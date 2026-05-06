import db from "../db/db.js";
import path from "path";
import { md5 } from "../utils/md5.js";

export const loginForm = (req, res) => {
  res.send(`<form method="POST" action="/login">
  <input name="username">
  <input name="password" type="password">
  <button>Login</button>
  </form>`);
};

export const registerForm = (req, res) => {
  res.send(`<form method="POST" action="/register">
  <input name="username">
  <input name="email">
  <input name="password" type="password">
  <button>Register</button>
  </form>`);
};

export const register = async (req, res) => {
  const { username, password, email } = req.body;

  await db.query(
    "INSERT INTO users (username, password, email) VALUES (?, ?, ?)",
    [username, md5(password), email]
  );

  res.redirect("/login");
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  const [rows] = await db.query(
    "SELECT * FROM users WHERE username=? AND password=?",
    [username, md5(password)]
  );

  if (rows.length === 0) return res.send("Login incorrecto");

  req.session.user = rows[0];
  res.redirect(`/portfolio/${username}`);
};

export const logout = (req, res) => {
  req.session.destroy(() => res.redirect("/login"));
};