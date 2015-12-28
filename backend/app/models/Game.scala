package models

import models.FakeDB._

import scala.concurrent.Future

/**
 * Created by tiezad on 28.12.2015.
 */
case class Game(
  id: Long,
  creatorId: Long,
  name: String,
  players: List[User])

object Game {
  import FakeDB.games

  def findById(id: Long): Future[Option[Game]] = Future.successful {
    games.get(id)
  }

  def findByCreatorId(creatorId: Long): Future[Seq[Game]] = Future.successful {
    games.filter(p => p.creatorId == creatorId)
  }

  def insert(creatorId: Long, name: String): Future[(Long, Game)] = Future.successful {
    games.insert(Game(_, creatorId, name, List.empty))
  }

  def update(id: Long, name: String): Future[Boolean] = Future.successful {
    games.update(id)(_.copy(name = name))
  }

  def delete(id: Long): Future[Unit] = Future.successful {
    games.delete(id)
  }

  def list: Future[Seq[Game]] = Future.successful {
    games.values.sortBy(_.name)
  }

}