package models

import java.sql.Date

case class Schedule(
  id: Option[Long],
  tournamentId: Option[Long],
  gameTime: Date,
  group: String,
  homeTeam: String,
  visitorTeam: String,
  homeScore: Option[Int] = None,
  visitorScore: Option[Int] = None)