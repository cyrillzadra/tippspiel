package models.tables

/**
 * Created by tiezad on 29.12.2015.
 */

import javax.inject.{ Inject, Singleton }

import models.User
import play.api.db.slick.{ DatabaseConfigProvider, HasDatabaseConfigProvider }
import slick.driver.JdbcProfile

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

trait UserTable {
  self: HasDatabaseConfigProvider[JdbcProfile] =>

  import driver.api._

  class UserT(tag: Tag) extends Table[User](tag, "USER") {

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

  val users = TableQuery[UserT]

  /** Retrieve a user by id. */
  def findById(id: Long): Future[Option[User]] =
    db.run(users.filter(_.id === id).result.headOption)

  /** Retrieve a user by E-Mail. */
  def findByEmail(email: String): Future[Option[User]] =
    db.run(users.filter(_.email === email).result.headOption)

  /** Insert a new user */
  def insert(user: User): Future[Unit] =
    db.run(users += user).map(_ => ())

  /** Insert new users */
  def insert(users: Seq[User]): Future[Unit] =
    db.run(this.users ++= users).map(_ => ())

  //TODO
  def insert(email: String, password: String, name: String): Future[Unit] = Future.successful {
    //TODO set active to false - email confirmation
    db.run(users += User(10, email, password, name, false, active = true))
      .map(_ => ())
  }

  /** Update a User. */
  def update(id: Long, user: User): Future[Unit] = {
    val userToUpdate: User = user.copy(id)
    db.run(users.filter(_.id === id).update(userToUpdate)).map(_ => ())
  }

  /** Update a User. */
  def updatePassword(id: Long, password: String): Future[Unit] = {
    db.run(users.filter(_.id === id)
      .map(col => col.password)
      .update(password).map(_ => ()))
  }

  /** Return a list of (User) */
  def list: Future[Seq[User]] =
    db.run(users.result)

  /** Delete a User. */
  def delete(id: Long): Future[Unit] =
    db.run(users.filter(_.id === id).delete).map(_ => ())

  def confirmEmail(id: Long): Future[Unit] = Future.successful {
    db.run(users.filter(_.id === id)
      .map(col => (col.active, col.emailConfirmed))
      .update(true, true)).map(_ => ())
  }

  def setup(): Boolean = {
    users.schema.create.statements.foreach(println)

    dbConfig.db.run(DBIO.seq(
      users.schema.create,

      // Insert some users
      users += User(1, "user1@mail.com", "123456", "User 1", true, true),
      users += User(2, "user2@mail.com", "123456", "User 2", true, true),
      users += User(3, "user3@mail.com", "123456", "User 3", true, true)

    ))

    true
  }
}