package models.tables

/**
 * Created by tiezad on 29.12.2015.
 */

import javax.inject.Inject
import javax.inject.Singleton

import org.joda.time.DateTime

import scala.concurrent.ExecutionContext.Implicits.global

import models.{ Tournament }
import play.api.db.slick.{ DatabaseConfigProvider, HasDatabaseConfigProvider }
import slick.driver.{ H2Driver, JdbcProfile }

import scala.concurrent.{ Future }

trait TournamentTable { self: HasDatabaseConfigProvider[JdbcProfile] =>

  import driver.api._

  class Tournaments(tag: Tag) extends Table[Tournament](tag, "TOURNAMENT") {

    def id = column[Long]("ID", O.PrimaryKey, O.AutoInc)
    def name = column[String]("NAME")

    def * = (id, name) <> (Tournament.tupled, Tournament.unapply _)
  }
}

@Singleton()
class TournamentDao @Inject() (protected val dbConfigProvider: DatabaseConfigProvider) extends TournamentTable
    with HasDatabaseConfigProvider[JdbcProfile] {

  import driver.api._

  val tournaments = TableQuery[Tournaments]

  /** Retrieve a tournament by id. */
  def findById(id: Long): Future[Option[Tournament]] =
    db.run(tournaments.filter(_.id === id).result.headOption)

  /** Insert a new tournament */
  def insert(tournament: Tournament): Future[Unit] =
    db.run(tournaments += tournament).map(_ => ())

  /** Insert new tournaments */
  def insert(tournaments: Seq[Tournament]): Future[Unit] =
    db.run(this.tournaments ++= tournaments).map(_ => ())

  /** Update a tournament. */
  def update(id: Long, tournament: Tournament): Future[Unit] = {
    val tournamentToUpdate: Tournament = tournament.copy(id)
    db.run(tournaments.filter(_.id === id).update(tournamentToUpdate)).map(_ => ())
  }

  /** Return a list of (Tournament) */
  def list: Future[Seq[Tournament]] =
    db.run(tournaments.result)

  def setup(): Boolean = {
    tournaments.schema.create.statements.foreach(println)

    dbConfig.db.run(DBIO.seq(
      tournaments.schema.create,

      // Insert some users
      tournaments += Tournament(1, "EM 2016")
    ))

    true
  }
}