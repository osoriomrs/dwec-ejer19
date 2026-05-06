import db from "../db/db.js";

export const dashboard = async (req, res) => {
  const userId = req.session.user.id;

  const [userRows] = await db.query(
    "SELECT * FROM users WHERE id=?",
    [userId]
  );

  const user = userRows[0];

  const [projects] = await db.query(
    "SELECT * FROM projects WHERE user_id=?",
    [userId]
  );

  const [socials] = await db.query(
    "SELECT * FROM social_links WHERE user_id=?",
    [userId]
  );

  res.send(`
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">

  <nav class="navbar navbar-dark bg-dark px-3">
    <a class="btn btn-light btn-sm" href="/">Inicio</a>
    <a class="btn btn-light btn-sm" href="/portfolio/${user.username}">Ver portfolios</a>
    <span class="text-white">Logged in as ${user.username}</span>
    <a class="btn btn-danger btn-sm" href="/logout">Logout</a>
  </nav>

  <div class="container mt-4">

    <div class="card p-3 mb-3">
      <form method="POST" action="/dashboard/profile">
        <input class="form-control mb-2" name="bio" value="${user.bio || ""}">
        <input class="form-control mb-2" name="email" value="${user.email}">
        <button class="btn btn-primary">Actualizar perfil</button>
      </form>
    </div>

    <div class="row">

      <div class="col-md-6">
        <div class="card p-3">
          <h3>Proyectos</h3>

          ${projects.map(p => `
            <p><b>${p.title}</b>
            <a href="/dashboard/project/delete/${p.id}">Borrar</a></p>
          `).join("")}

          <form method="POST" action="/dashboard/project">
            <input class="form-control mb-2" name="title">
            <input class="form-control mb-2" name="description">
            <button class="btn btn-success">Agregar</button>
          </form>
        </div>
      </div>

      <div class="col-md-6">
        <div class="card p-3">
          <h3>Redes</h3>

          ${socials.map(s => `
            <p><b>${s.platform}</b>
            <a href="/dashboard/social/delete/${s.id}">Borrar</a></p>
          `).join("")}

          <form method="POST" action="/dashboard/social">
            <input class="form-control mb-2" name="platform">
            <input class="form-control mb-2" name="url">
            <button class="btn btn-primary">Agregar</button>
          </form>
        </div>
      </div>

    </div>

  </div>
  `);
};

export const updateProfile = async (req, res) => {
  const { bio, email } = req.body;

  await db.query(
    "UPDATE users SET bio=?, email=? WHERE id=?",
    [bio, email, req.session.user.id]
  );

  res.redirect("/dashboard");
};

export const addProject = async (req, res) => {
  const { title, description } = req.body;

  await db.query(
    "INSERT INTO projects (title, description, user_id) VALUES (?, ?, ?)",
    [title, description, req.session.user.id]
  );

  res.redirect("/dashboard");
};

export const deleteProject = async (req, res) => {
  await db.query(
    "DELETE FROM projects WHERE id=? AND user_id=?",
    [req.params.id, req.session.user.id]
  );

  res.redirect("/dashboard");
};

export const addSocial = async (req, res) => {
  const { platform, url } = req.body;

  await db.query(
    "INSERT INTO social_links (platform, url, user_id) VALUES (?, ?, ?)",
    [platform, url, req.session.user.id]
  );

  res.redirect("/dashboard");
};

export const deleteSocial = async (req, res) => {
  await db.query(
    "DELETE FROM social_links WHERE id=? AND user_id=?",
    [req.params.id, req.session.user.id]
  );

  res.redirect("/dashboard");
};