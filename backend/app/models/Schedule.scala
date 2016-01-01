package models

import java.sql.Date

import scala.concurrent.Future

case class Schedule(
  id: Option[Long],
  tournamentId: Option[Long],
  gameTime: Date,
  group: String,
  homeTeam: String,
  visitorTeam: String,
  homeScore: Int,
  visitorScore: Int)

object FakeScheduleDao {

  import FakeDB.schedules

  def findById(id: Long): Future[Option[Schedule]] = Future.successful {
    schedules.get(id)
  }

  //def insert(tournamentId: Option[Long], gameTime: Date, group: String, homeTeam: String, visitorTeam: String, homeScore: Int, visitorScore: Int): Future[(Long, Schedule)] = Future.successful {
  //  schedules.insert(Schedule(_, tournamentId, gameTime, group, homeTeam, visitorTeam, homeScore, visitorScore))
  //}

  def update(id: Long, tournamentId: Long, gameTime: Date, group: String, homeTeam: String, visitorTeam: String, homeScore: Int, visitorScore: Int): Future[Boolean] = Future.successful {
    //TODO update for all attributes
    schedules.update(id)(_.copy(group = group))
  }

  def delete(id: Long): Future[Unit] = Future.successful {
    schedules.delete(id)
  }

  def list: Future[Seq[Schedule]] = Future.successful {
    schedules.values.sortBy(_.group)
  }

}
