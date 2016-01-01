package controllers

import models.SetupDataBase
import models.tables.{ UserDao, TournamentDao, ScheduleDao }
import play.api.db
import play.api.mvc._
import javax.inject.Inject
import play.api.i18n.{ MessagesApi }
import slick.jdbc.meta.MTable

import scala.concurrent.duration.Duration
import scala.concurrent.{ Await, Future }
import scala.concurrent.ExecutionContext.Implicits.global

class Application @Inject() (userDao: UserDao, tournamentDao: TournamentDao, scheduleDao: ScheduleDao, val messagesApi: MessagesApi) extends api.ApiController {

  def test = ApiAction { implicit request =>
    ok("The API is ready")
  }

  // Auxiliar to check the FakeDB information. It's only for testing purpose. You should remove it.
  def fakeDB = Action { implicit request =>
    Ok(views.html.fakeDB())
  }

  def realDB = Action.async { implicit request =>
    val userList = userDao.list
    userList.map(users => Ok(views.html.realDB(users)))
  }

  def setupRealDB = Action { implicit request =>
    val userCreated: Boolean = userDao.setup()
    val tournamentsCreated: Boolean = tournamentDao.setup()
    val schedulesCreated: Boolean = scheduleDao.setup()

    Ok(views.html.setupRealDB(SetupDataBase(userCreated, tournamentsCreated, schedulesCreated)))
  }

}