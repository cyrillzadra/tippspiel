package controllers

import java.sql.Date
import javax.inject.Inject

import models.{ Country, Schedule, Tournament }
import models.tables.{ ScheduleDao, TournamentDao, UserDao }
import play.api.data.Form
import play.api.data.Forms.{ date, longNumber, mapping, nonEmptyText, optional, number, sqlDate }
import play.api.i18n.{ I18nSupport, MessagesApi }
import play.api.mvc._
import play.i18n._

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class Admin @Inject() (userDao: UserDao, tournamentDao: TournamentDao, scheduleDao: ScheduleDao, val messagesApi: MessagesApi) extends Controller with I18nSupport {

  val TournamentHome = Redirect(routes.Admin.tournaments())

  val tournamentForm = Form(
    mapping(
      "id" -> longNumber,
      "name" -> nonEmptyText
    )(Tournament.apply)(Tournament.unapply)
  )

  /**
   * tournament edit form
   * @param id
   * @return
   */
  def tournamentEdit(id: Long) = Action.async { implicit rs =>
    val tournament = for {
      t <- tournamentDao.findById(id)
    } yield t

    tournament.map {
      case (t) =>
        t match {
          case Some(c) => Ok(views.html.admin.tournamentEdit(id, tournamentForm.fill(c)))
          case None => NotFound
        }
    }
  }

  /**
   * handles tournament edit form changes
   * @param id
   * @return
   */
  def tournamentUpdate(id: Long) = Action.async { implicit rs =>
    tournamentForm.bindFromRequest.fold(formHasErrors => {
      Future.successful(BadRequest(views.html.admin.tournamentEdit(id, formHasErrors)))
    },
      tournament => {
        val x = tournamentDao.update(id, tournament)
        Future.successful(TournamentHome.flashing("success" -> "Tournament %s has been updated".format(tournament.name)))
      })
  }

  def tournaments = Action.async { implicit request =>
    val userList = tournamentDao.list
    userList.map(tournaments => Ok(views.html.admin.tournamentList(tournaments)))
  }

  val schedulesForm = Form(
    mapping(
      "id" -> optional(longNumber),
      "tournamentId" -> optional(longNumber),
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
        Future.successful(TournamentHome.flashing("success" -> "Schedule %s - %s has been updated".format(schedule.homeTeam, schedule.visitorTeam)))
      })
  }

  def schedules = Action.async { implicit request =>
    val schedulesList = scheduleDao.list
    schedulesList.map(schedules => {
      println("# schedules = " + schedules.size)
      Ok(views.html.admin.schedulesList(schedules))
    })
  }

  def schedulesOfTournament(tournamentId: Long) = Action.async { implicit request =>
    val schedulesList = scheduleDao.list(tournamentId)
    schedulesList.map(schedules => {
      println("# schedules = " + schedules.size)
      Ok(views.html.admin.schedulesList(schedules))
    })
  }

  def scheduleCreate(tournamentId: Long) = Action.async { implicit rs =>
    Future.successful(Ok(views.html.admin.scheduleCreate(tournamentId, teams, schedulesForm)))
  }

  def scheduleSave(tournamentId: Long) = Action.async { implicit rs =>
    schedulesForm.bindFromRequest.fold(
      formHasErrors => Future.successful(BadRequest(views.html.admin.scheduleCreate(tournamentId, teams, formHasErrors))),
      schedule => {
        val x = scheduleDao.insert(schedule)
        Future.successful(TournamentHome.flashing("success" -> "Schedule has been created"))
      })
  }

}
