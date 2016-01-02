package models.tables

/**
 * Created by tiezad on 29.12.2015.
 */

import java.sql.Date
import java.text.SimpleDateFormat
import javax.inject.Inject
import javax.inject.Singleton

import scala.concurrent.ExecutionContext.Implicits.global

import models.{ Country, Tournament, Schedule, User }
import play.api.db.slick.{ DatabaseConfigProvider, HasDatabaseConfigProvider }
import slick.driver.JdbcProfile

import scala.concurrent.{ Await, Future }

trait ScheduleTable { self: HasDatabaseConfigProvider[JdbcProfile] =>

  import driver.api._

  class SchedulesT(tag: Tag) extends Table[Schedule](tag, "SCHEDULE") {

    def id = column[Long]("ID", O.PrimaryKey, O.AutoInc)
    def tournamentId = column[Long]("TOURNAMENT_ID")
    def gameTime = column[Date]("GAME_TIME")
    def group = column[String]("GROUP")
    def homeTeam = column[String]("HOME_TEAM")
    def visitorTeam = column[String]("VISITOR_TEAM")
    def homeScore = column[Int]("HOME_SCORE")
    def visitorScore = column[Int]("VISITOR_SCORE")

    def * = (id.?, tournamentId.?, gameTime, group, homeTeam, visitorTeam, homeScore, visitorScore) <> (Schedule.tupled, Schedule.unapply _)
  }
}

@Singleton()
class ScheduleDao @Inject() (protected val dbConfigProvider: DatabaseConfigProvider) extends ScheduleTable
    with HasDatabaseConfigProvider[JdbcProfile] {

  val dt = new SimpleDateFormat("yyyy-mm-dd hh:mm:ss")

  import driver.api._

  val schedules = TableQuery[SchedulesT]

  /** Retrieve a Schedule by id. */
  def findById(id: Long): Future[Option[Schedule]] =
    db.run(schedules.filter(_.id === id).result.headOption)

  /** Insert a new Schedule */
  def insert(schedule: Schedule): Future[Unit] =
    db.run(schedules += schedule).map(_ => ())

  /** Insert new Schedules */
  def insert(schedules: Seq[Schedule]): Future[Unit] =
    db.run(this.schedules ++= schedules).map(_ => ())

  /** Update a Schedule. */
  def update(id: Long, schedule: Schedule): Future[Unit] = {
    val scheduleToUpdate: Schedule = schedule.copy(Some(id))
    db.run(schedules.filter(_.id === id).update(scheduleToUpdate)).map(_ => ())
  }

  /** Return a list of all Schedule */
  def list: Future[Seq[Schedule]] = {
    val listStmt = schedules.result
    println(listStmt.statements)
    db.run(listStmt)
  }

  /** Return a list of Schedule of specific Tournament */
  def list(tournamentId: Long): Future[Seq[Schedule]] = {
    val listStmt = schedules.filter(_.tournamentId === tournamentId).result
    println(listStmt.statements)
    db.run(listStmt)
  }

  /** Delete a Schedule. */
  def delete(id: Long): Future[Unit] =
    db.run(schedules.filter(_.id === id).delete).map(_ => ())

  def setup(): Boolean = {
    schedules.schema.create.statements.foreach(println)

    dbConfig.db.run(DBIO.seq(
      schedules.schema.create,

      // Insert some schedules
      schedules += Schedule(None, Some(1L), new java.sql.Date(dt.parse("2015-09-06 10:11:00").getTime), "A", Country.FR.toString, Country.RO.toString, 0, 1),
      schedules += Schedule(None, Some(1L), new java.sql.Date(dt.parse("2015-09-06 10:11:00").getTime), "A", Country.AL.toString, Country.CH.toString, 0, 1),
      schedules += Schedule(None, Some(1L), new java.sql.Date(dt.parse("2015-09-06 10:11:00").getTime), "A", Country.RO.toString, Country.CH.toString, 0, 1),
      schedules += Schedule(None, Some(1L), new java.sql.Date(dt.parse("2015-09-06 10:11:00").getTime), "B", Country.GB.toString, Country.RU.toString, 0, 1)
    ))

    println(schedules.insertStatement)

    true
  }
}