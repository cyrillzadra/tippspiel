package models

case class User(
  id: Long,
  email: String,
  password: String,
  name: String,
  country: String,
  emailConfirmed: Boolean)