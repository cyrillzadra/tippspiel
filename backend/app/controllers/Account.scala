package controllers

import api.ApiError._
import api.JsonCombinators._
import models.{ Game, User, UserDao, ApiToken }
import play.api.mvc._
import scala.concurrent.Future
import scala.concurrent.ExecutionContext.Implicits.global
import javax.inject.Inject
import play.api.i18n.{ MessagesApi }
import play.api.libs.json._
import play.api.libs.functional.syntax._

class Account @Inject() (val messagesApi: MessagesApi) extends api.ApiController {

  def info = SecuredApiAction { implicit request =>
    maybeItem(UserDao.findById(request.userId))
  }

  def myGames = SecuredApiAction { implicit request =>
    val x = Game.findByCreatorId(request.userId)
    x.flatMap { list =>
      ok(list.map(g => Json.obj("id" -> g.id, "creatorId" -> g.creatorId, "name" -> g.name, "players" -> g.players.length)))
    }
  }

  def update = SecuredApiActionWithBody { implicit request =>
    readFromRequest[User] { user =>
      UserDao.update(request.userId, user.name).flatMap { isOk =>
        if (isOk) noContent() else errorInternal
      }
    }
  }

  implicit val pwdsReads: Reads[Tuple2[String, String]] = (
    (__ \ "old").read[String](Reads.minLength[String](1)) and
      (__ \ "new").read[String](Reads.minLength[String](6)) tupled
  )

  def updatePassword = SecuredApiActionWithBody { implicit request =>
    readFromRequest[Tuple2[String, String]] {
      case (oldPwd, newPwd) =>
        UserDao.findById(request.userId).flatMap {
          case None => errorUserNotFound
          case Some(user) if (oldPwd != user.password) => errorCustom("api.error.reset.pwd.old.incorrect")
          case Some(user) => UserDao.updatePassword(request.userId, newPwd).flatMap { isOk =>
            if (isOk) noContent() else errorInternal
          }
        }
    }
  }

  def delete = SecuredApiAction { implicit request =>
    ApiToken.delete(request.token).flatMap { _ =>
      UserDao.delete(request.userId).flatMap { _ =>
        noContent()
      }
    }
  }

}