package models

import api.Page
import java.text.SimpleDateFormat
import org.joda.time.DateTime
import org.joda.time.format.DateTimeFormat

import scala.collection.mutable.Map

/*
* A fake DB to store and load all the data
*/
object FakeDB {

  private val dtf = DateTimeFormat.forPattern("yyyy-mm-dd hh:mm:ss")

  val dt = new SimpleDateFormat("yyyy-mm-dd hh:mm:ss")

  // API KEYS
  val apiKeys = FakeTable(
    1L -> ApiKey(apiKey = "AbCdEfGhIjK1", name = "ios-app", active = true),
    2L -> ApiKey(apiKey = "AbCdEfGhIjK2", name = "android-app", active = true)
  )

  // TOKENS
  val tokens = FakeTable[ApiToken]()

  // API REQUEST LOG
  val logs = FakeTable[ApiLog]()

  // USERS
  val users = FakeTable(
    1L -> User(1L, "user1@mail.com", "123456", "User 1", true, true),
    2L -> User(2L, "user2@mail.com", "123456", "User 2", true, true),
    3L -> User(3L, "user3@mail.com", "123456", "User 3", true, true)
  )

  // TOURNAMENTS
  val tournaments = FakeTable(
    1L -> Tournament(1L, "EM 2015")
  )

  // SCHEDULES
  val schedules = FakeTable(
    1L -> Schedule(1L, 1L, DateTime.parse("2015-09-06 10:11:00", dtf), "A", "Frankreich", "Rumänien", 0, 1),
    2L -> Schedule(2L, 1L, DateTime.parse("2015-09-06 10:11:00", dtf), "A", "Frankreich", "Rumänien", 0, 1),
    3L -> Schedule(3L, 1L, DateTime.parse("2015-09-06 10:11:00", dtf), "A", "Frankreich", "Rumänien", 0, 1),
    4L -> Schedule(4L, 1L, DateTime.parse("2015-09-06 10:11:00", dtf), "A", "Frankreich", "Rumänien", 0, 1),
    5L -> Schedule(5L, 1L, DateTime.parse("2015-09-06 10:11:00", dtf), "B", "Frankreich", "Rumänien", 0, 1),
    6L -> Schedule(6L, 1L, DateTime.parse("2015-09-06 10:11:00", dtf), "b", "Frankreich", "Rumänien", 0, 1)
  )

  // GAMES
  val games = FakeTable(
    1L -> Game(1L, 1L, "Game Name 1", List.empty),
    2L -> Game(2L, 1L, "Game Name 2", List.empty),
    3L -> Game(3L, 2L, "Game Name 3", List.empty)
  )

  /*
	* Fake table that emulates a SQL table with an auto-increment index
	*/
  case class FakeTable[A](var table: Map[Long, A], var incr: Long) {
    def nextId: Long = {
      if (!table.contains(incr))
        incr
      else {
        incr += 1
        nextId
      }
    }
    def get(id: Long): Option[A] = table.get(id)
    def find(p: A => Boolean): Option[A] = table.values.find(p)
    def insert(a: Long => A): (Long, A) = {
      val id = nextId
      val tuple = (id -> a(id))
      table += tuple
      incr += 1
      tuple
    }
    def update(id: Long)(f: A => A): Boolean = {
      get(id).map { a =>
        table += (id -> f(a))
        true
      }.getOrElse(false)
    }
    def delete(id: Long): Unit = table -= id
    def delete(p: A => Boolean): Unit = table = table.filterNot { case (id, a) => p(a) }

    def values: List[A] = table.values.toList
    def map[B](f: A => B): List[B] = values.map(f)
    def filter(p: A => Boolean): List[A] = values.filter(p)
    def exists(p: A => Boolean): Boolean = values.exists(p)
    def count(p: A => Boolean): Int = values.count(p)
    def size: Int = table.size
    def isEmpty: Boolean = size == 0

    def page(p: Int, s: Int)(filterFunc: A => Boolean)(sortFuncs: ((A, A) => Boolean)*): Page[A] = {
      val items = filter(filterFunc)
      val sorted = sortFuncs.foldRight(items)((f, items) => items.sortWith(f))
      Page(
        items = sorted.drop((p - 1) * s).take(s),
        page = p,
        size = s,
        total = sorted.size
      )
    }
  }

  object FakeTable {
    def apply[A](elements: (Long, A)*): FakeTable[A] = apply(Map(elements: _*), elements.size + 1)
  }

}
