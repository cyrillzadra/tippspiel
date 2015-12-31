package models

import scala.concurrent.Future

case class Tournament(
  id: Long,
  name: String)

object FakeTournamentDao {
  import FakeDB.tournaments

  def findById(id: Long): Future[Option[Tournament]] = Future.successful {
    tournaments.get(id)
  }

  def insert(name: String): Future[(Long, Tournament)] = Future.successful {
    tournaments.insert(Tournament(_, name))
  }

  def update(id: Long, name: String): Future[Boolean] = Future.successful {
    tournaments.update(id)(_.copy(name = name))
  }

  def delete(id: Long): Future[Unit] = Future.successful {
    tournaments.delete(id)
  }

  def list: Future[Seq[Tournament]] = Future.successful {
    tournaments.values.sortBy(_.name)
  }

}
