package controllers

import javax.inject.Inject

import api.ApiError._
import api.JsonCombinators._
import models.tables.TournamentDao
import models.{ ApiToken, FakeUserDao, Game, User }
import play.api.i18n.MessagesApi
import play.api.libs.functional.syntax._
import play.api.libs.json._

import scala.concurrent.ExecutionContext.Implicits.global

class Tournament @Inject() (tournamentDao: TournamentDao, val messagesApi: MessagesApi) extends api.ApiController {

  def list = SecuredApiAction { implicit request =>
    val x = tournamentDao.list
    x.flatMap { list =>
      ok(list.map(g => Json.obj("id" -> g.id, "name" -> g.name)))
    }
  }

  def info(id: Long) = SecuredApiAction { implicit request =>
    maybeItem(tournamentDao.findById(id))
  }

}