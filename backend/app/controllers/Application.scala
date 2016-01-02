package controllers

import models.SetupDataBase
import models.tables.{ GameDao, UserDao, TournamentDao, ScheduleDao }
import play.api.db
import play.api.mvc._
import javax.inject.Inject
import play.api.i18n.{ MessagesApi }
import slick.jdbc.meta.MTable

import scala.concurrent.duration.Duration
import scala.concurrent.{ Await, Future }
import scala.concurrent.ExecutionContext.Implicits.global

class Application @Inject() (userDao: UserDao, tournamentDao: TournamentDao,
    scheduleDao: ScheduleDao, gameDao: GameDao, val messagesApi: MessagesApi) extends api.ApiController {

  def test = ApiAction { implicit request =>
    ok("The API is ready")
  }

  def realDB = Action.async { implicit request =>
    val userList = userDao.list
    userList.map(users => Ok(views.html.realDB(users)))
  }

  def setupRealDB = Action { implicit request =>
    val usersCreated: Boolean = userDao.setup()
    val tournamentsCreated: Boolean = tournamentDao.setup()
    val schedulesCreated: Boolean = scheduleDao.setup()
    val gamesCreated: Boolean = gameDao.setup()

    Ok(views.html.setupRealDB(SetupDataBase(usersCreated, tournamentsCreated, schedulesCreated, gamesCreated)))
  }

}