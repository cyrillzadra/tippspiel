package controllers

import javax.inject.Inject

import models.tables.TournamentDao
import play.api.i18n.MessagesApi
import play.api.libs.json._

import scala.concurrent.ExecutionContext.Implicits.global

class Schedules @Inject() (tournamentDao: TournamentDao, val messagesApi: MessagesApi) extends api.ApiController {

  def list(id: Long) = SecuredApiAction { implicit request =>
    val x = tournamentDao.list
    x.flatMap { list =>
      ok(list.map(g => Json.obj("id" -> g.id, "name" -> g.name)))
    }
  }

}