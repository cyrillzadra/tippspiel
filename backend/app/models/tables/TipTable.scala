package models.tables

/**
 * Created by tiezad on 29.12.2015.
 */

import javax.inject.{ Inject, Singleton }

import play.api.db.slick.{ DatabaseConfigProvider, HasDatabaseConfigProvider }
import slick.driver.JdbcProfile

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

case class Tip(
  userId: Long,
  groupId: Long,
  scheduleId: Long,
  homeScore: Option[Int] = None,
  visitorScore: Option[Int] = None)

@Singleton()
class TipDao @Inject() (protected val dbConfigProvider: DatabaseConfigProvider) extends Schema
    with HasDatabaseConfigProvider[JdbcProfile] {

  import driver.api._

  val tips = TableQuery[TipT]

  /** Insert a new tip */
  def insert(tip: Tip): Future[Unit] =
    db.run(tips += tip).map(_ => ())

  /** Insert new tips */
  def insert(tips: Seq[Tip]): Future[Unit] =
    db.run(this.tips ++= tips).map(_ => ())

  /** Return a list of (Tip) */
  def list: Future[Seq[Tip]] =
    db.run(tips.result)

  def setup(): Boolean = {
    tips.schema.create.statements.foreach(println)

    dbConfig.db.run(DBIO.seq(
      tips.schema.create,

      // Insert some Groups
      tips += Tip(1, 1, 1, None, None),
      tips += Tip(1, 1, 2, None, None),
      tips += Tip(1, 1, 3, None, None)

    ))

    true
  }
}