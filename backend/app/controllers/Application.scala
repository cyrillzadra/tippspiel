package controllers

import models.SetupDataBase
import models.tables.{ TournamentDao, UserDao }
import play.api.db
import play.api.mvc._
import javax.inject.Inject
import play.api.i18n.{ MessagesApi }
import slick.jdbc.meta.MTable

import scala.concurrent.duration.Duration
import scala.concurrent.{ Await, Future }
import scala.concurrent.ExecutionContext.Implicits.global

class Application @Inject() (usersDao: UserDao, tournamentsDao: TournamentDao, val messagesApi: MessagesApi) extends api.ApiController {

  def test = ApiAction { implicit request =>
    ok("The API is ready")
  }

  // Auxiliar to check the FakeDB information. It's only for testing purpose. You should remove it.
  def fakeDB = Action { implicit request =>
    Ok(views.html.fakeDB())
  }

  def realDB = Action.async { implicit request =>

    val users = usersDao.list
    users.map(u => Ok(views.html.realDB(u)))

  }

  def setupRealDB = Action { implicit request =>
    val userCreated: Boolean = usersDao.setup()
    val tournamentsCreated: Boolean = tournamentsDao.setup()

    Ok(views.html.setupRealDB(SetupDataBase(userCreated, tournamentsCreated, false)))
  }

}
