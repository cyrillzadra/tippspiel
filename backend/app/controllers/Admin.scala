package controllers

import java.sql.Date
import javax.inject.Inject

import models.{ User, Country, Schedule }
import models.tables.{ ScheduleDao, UserDao }
import play.api.data.Form
import play.api.data.Forms.{ date, longNumber, mapping, nonEmptyText, optional, number, sqlDate }
import play.api.i18n.{ I18nSupport, MessagesApi }
import play.api.libs.mailer.{ MailerClient, Email }
import play.api.mvc._
import play.i18n._

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class Admin @Inject() (userDao: UserDao,
    scheduleDao: ScheduleDao, val messagesApi: MessagesApi) extends Controller with I18nSupport {

  val schedulesForm = Form(
    mapping(
      "id" -> optional(longNumber),
      "gameTime" -> sqlDate,
      "group" -> nonEmptyText,
      "homeTeam" -> nonEmptyText,
      "visitorTeam" -> nonEmptyText,
      "homeScore" -> optional(number(min = 0, max = 100)),
      "visitorScore" -> optional(number(min = 0, max = 100))
    )(Schedule.apply)(Schedule.unapply)
  )

  val teams: Seq[(String, String)] =
    Country.values.map(x => (x.toString, Messages.get("country." + x.toString))).toSeq

  /**
   *
   * @param scheduleId
   * @return
   */
  def scheduleEdit(scheduleId: Long) = Action.async { implicit rs =>
    val schedule = for {
      t <- scheduleDao.findById(scheduleId)
    } yield t

    schedule.map {
      case (t) =>
        t match {
          case Some(c) => Ok(views.html.admin.scheduleEdit(scheduleId, teams, schedulesForm.fill(c)))
          case None => NotFound
        }
    }
  }

  /**
   * handles schedule edit form changes
   * @param id
   * @return
   */
  def scheduleUpdate(id: Long) = Action.async { implicit rs =>
    schedulesForm.bindFromRequest.fold(formHasErrors => {
      Future.successful(BadRequest(views.html.admin.scheduleEdit(id, teams, formHasErrors)))
    },
      schedule => {
        val x = scheduleDao.update(id, schedule)
        Future.successful(Redirect(routes.Admin.schedulesOfTournament()).flashing("success" -> "Schedule %s - %s has been updated".format(schedule.homeTeam, schedule.visitorTeam)))
      })
  }

  def schedules = Action.async { implicit request =>
    val schedulesList = scheduleDao.list
    schedulesList.map(schedules => {
      println("# schedules = " + schedules.size)
      Ok(views.html.admin.schedulesList(schedules))
    })
  }

  def schedulesOfTournament = Action.async { implicit request =>
    val schedulesList = scheduleDao.list
    schedulesList.map(schedules => {
      println("# schedules = " + schedules.size)
      Ok(views.html.admin.schedulesList(schedules))
    })
  }

  def scheduleCreate() = Action.async { implicit rs =>
    Future.successful(Ok(views.html.admin.scheduleCreate(teams, schedulesForm)))
  }

  def scheduleSave() = Action.async { implicit rs =>
    schedulesForm.bindFromRequest.fold(
      formHasErrors => Future.successful(BadRequest(views.html.admin.scheduleCreate(teams, formHasErrors))),
      schedule => {
        val x = scheduleDao.insert(schedule)
        Future.successful(Redirect(routes.Admin.schedulesOfTournament()).flashing("success" -> "Schedule has been created"))
      })
  }

  /**
   * E-MAIL CONFIRMATION
   */
  // confirm url
  // signupconfirmation?userId=&confirmationToken=?
  def signupConfirmation(userId: Long, confirmationToken: String) = Action.async { implicit request =>
    userDao.findById(userId).flatMap {
      case Some(user) => Future.successful(Ok(views.html.emailConfirmation(user)))
      case None => Future.successful(Ok(views.html.emailConfirmationFailed("Failed")))
    }
  }

}
