import db from "../db/db.js";
import path from "path";
import { md5 } from "../utils/md5.js";

export const loginForm = (req, res) => {
   res.send(`
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">

  <div class="d-flex justify-content-center align-items-center vh-100 bg-light">

    <div class="card p-4 shadow" style="width: 350px;">

      <h3 class="text-center mb-3">Login</h3>

      <form method="POST" action="/login">

        <input class="form-control mb-2" name="username" placeholder="Username">

        <input class="form-control mb-3" type="password" name="password" placeholder="Password">

        <button class="btn btn-primary w-100">Entrar</button>

      </form>

      <a class="btn btn-link mt-2" href="/register">Crear cuenta</a>

    </div>

  </div>
  `);
};

export const registerForm = (req, res) => {
  res.send(`
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">

  <div class="d-flex justify-content-center align-items-center vh-100 bg-light">

    <div class="card p-4 shadow" style="width: 350px;">

      <h3 class="text-center mb-3">Register</h3>

      <form method="POST" action="/register">

        <input class="form-control mb-2" name="username" placeholder="Username">

        <input class="form-control mb-2" name="email" placeholder="Email">

        <input class="form-control mb-3" type="password" name="password" placeholder="Password">

        <button class="btn btn-success w-100">Crear cuenta</button>

      </form>

      <a class="btn btn-link mt-2" href="/login">Ya tengo cuenta</a>

    </div>

  </div>
  `);
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