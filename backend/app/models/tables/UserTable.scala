package models.tables

/**
  * Created by tiezad on 29.12.2015.
  */
import models.User
import slick.driver.JdbcProfile

trait UserTable {
  protected val driver: JdbcProfile
  import driver.api._
  class Users(tag: Tag) extends Table[User](tag, "USER") {

    def id = column[Long]("ID")
    def email = column[String]("EMAIL")
    def password = column[String]("PASSWORD")
    def name = column[String]("NAME")
    def emailConfirmed = column[String]("EMAIL_CONFIRMED")
    def active = column[Boolean]("ACTIVE")

    def * = (id, email, password, name, emailConfirmed, active) <> (User.tupled, User.unapply _)
  }
}