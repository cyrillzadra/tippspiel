package models.tables

/**
 * Created by tiezad on 29.12.2015.
 */

import javax.inject.Inject
import javax.inject.Singleton
import slick.jdbc.meta.MTable

import scala.concurrent.ExecutionContext.Implicits.global

import models.User
import play.api.db.slick.{ DatabaseConfigProvider, HasDatabaseConfigProvider }
import slick.driver.JdbcProfile

import scala.concurrent.{ Await, Future }

trait UserTable { self: HasDatabaseConfigProvider[JdbcProfile] =>

  import driver.api._

  class Users(tag: Tag) extends Table[User](tag, "USER") {

    def id = column[Long]("ID")
    def email = column[String]("EMAIL")
    def password = column[String]("PASSWORD")
    def name = column[String]("NAME")
    def emailConfirmed = column[Boolean]("EMAIL_CONFIRMED")
    def active = column[Boolean]("ACTIVE")

    def * = (id, email, password, name, emailConfirmed, active) <> (User.tupled, User.unapply _)
  }
}

@Singleton()
class UserDao @Inject() (protected val dbConfigProvider: DatabaseConfigProvider) extends UserTable
    with HasDatabaseConfigProvider[JdbcProfile] {

  import driver.api._

  val users = TableQuery[Users]

  /** Insert a new company */
  def insert(user: User): Future[Unit] =
    db.run(users += user).map(_ => ())

  /** Insert new companies */
  def insert(users: Seq[User]): Future[Unit] =
    db.run(this.users ++= users).map(_ => ())

  /** Return a list of (User) */
  def list: Future[Seq[User]] =
    db.run(users.result)

  def setup(): Boolean = {
    users.schema.create.statements.foreach(println)

    dbConfig.db.run(DBIO.seq(
      users.schema.create,

      // Insert some users
      users += User(1, "user1@mail.com", "123456", "User 1", true, false),
      users += User(2, "user2@mail.com", "123456", "User 2", false, true),
      users += User(3, "user3@mail.com", "123456", "User 3", true, false)

    ))

    true
  }
}