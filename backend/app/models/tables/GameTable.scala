package models.tables

/**
 * Created by tiezad on 29.12.2015.
 */

import javax.inject.{ Inject, Singleton }

import play.api.db.slick.{ DatabaseConfigProvider, HasDatabaseConfigProvider }
import slick.driver.JdbcProfile

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

case class Game(
  id: Long,
  creatorId: Long,
  name: String)

trait GameTable { self: HasDatabaseConfigProvider[JdbcProfile] =>

  import driver.api._

  class GameT(tag: Tag) extends Table[Game](tag, "GAME") {

    def id = column[Long]("ID", O.PrimaryKey, O.AutoInc)
    def creatorId = column[Long]("CREATOR_ID")
    def name = column[String]("NAME")

    def * = (id, creatorId, name) <> (Game.tupled, Game.unapply _)
  }

}

@Singleton()
class GameDao @Inject() (protected val dbConfigProvider: DatabaseConfigProvider) extends GameTable
    with HasDatabaseConfigProvider[JdbcProfile] {

  import driver.api._

  val games = TableQuery[GameT]

  /** Retrieve a game by id. */
  def findById(id: Long): Future[Option[Game]] =
    db.run(games.filter(_.id === id).result.headOption)

  /** Insert a new company */
  def insert(game: Game): Future[Unit] =
    db.run(games += game).map(_ => ())

  /** Insert new companies */
  def insert(games: Seq[Game]): Future[Unit] =
    db.run(this.games ++= games).map(_ => ())

  /** Update a Game. */
  def update(id: Long, game: Game): Future[Unit] = {
    val gameToUpdate: Game = game.copy(id)
    db.run(games.filter(_.id === id).update(gameToUpdate)).map(_ => ())
  }

  /** Return a list of (Game) */
  def list: Future[Seq[Game]] =
    db.run(games.result)

  /** Return a list of (Game) by Creator Id */
  def listByCreatorId(userId: Long): Future[Seq[Game]] =
    db.run(games.filter(_.creatorId === userId).result)

  /** Delete a Game. */
  def delete(id: Long): Future[Unit] =
    db.run(games.filter(_.id === id).delete).map(_ => ())

  def setup(): Boolean = {
    games.schema.create.statements.foreach(println)

    dbConfig.db.run(DBIO.seq(
      games.schema.create,

      // Insert some Games
      games += Game(1, 1, "Game1@mail.com"),
      games += Game(2, 1, "Game2@mail.com"),
      games += Game(3, 1, "Game3@mail.com")

    ))

    true
  }
}