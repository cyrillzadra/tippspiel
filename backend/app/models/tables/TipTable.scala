package models.tables

/**
  * Created by tiezad on 29.12.2015.
  */

import javax.inject.{Inject, Singleton}

import play.api.db.slick.{DatabaseConfigProvider, HasDatabaseConfigProvider}
import slick.driver.JdbcProfile

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

case class Tip(
                id: Long,
                playerId: Long,
                groupId: Long,
                scheduleId: Long,
                homeScore: Option[Int] = None,
                visitorScore: Option[Int] = None)

trait TipTable {
  self: HasDatabaseConfigProvider[JdbcProfile] =>

  import driver.api._

  class TipT(tag: Tag) extends Table[Tip](tag, "PLAYER_TIP") {
    //TODO remove tipId!!!
    def id = column[Long]("ID", O.PrimaryKey, O.AutoInc)

    def playerId = column[Long]("PLAYER_ID")

    def groupId = column[Long]("GROUP_ID")

    def scheduleId = column[Long]("SCHEDULE_ID")

    def homeScore = column[Option[Int]]("HOME_SCORE")

    def visitorScore = column[Option[Int]]("VISITOR_SCORE")

    def * = (id, groupId, scheduleId, playerId, homeScore, visitorScore) <>(Tip.tupled, Tip.unapply _)
  }

}

@Singleton()
class TipDao @Inject()(protected val dbConfigProvider: DatabaseConfigProvider) extends TipTable
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
      tips += Tip(1, 1, 1, 1, None, None),
      tips += Tip(2, 1, 1, 1, None, None),
      tips += Tip(3, 1, 1, 1, None, None)

    ))

    true
  }
}