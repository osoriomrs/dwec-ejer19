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
            <div class="border p-2 mb-2">
              <b>${p.title}</b>
              <p>${p.description}</p>

              <div class="d-flex gap-2">

                <a class="btn btn-sm btn-warning"
                   href="/dashboard/project/edit/${p.id}">
                  Editar
                </a>

                <a class="btn btn-sm btn-danger"
                   href="/dashboard/project/delete/${p.id}">
                  Borrar
                </a>

              </div>
            </div>
          `).join("")}

          <form method="POST" action="/dashboard/project">
            <input class="form-control mb-2" name="title" placeholder="titulo">
            <input class="form-control mb-2" name="description" placeholder="descripcion">
            <button class="btn btn-success">Agregar</button>
          </form>

        </div>
      </div>

      <div class="col-md-6">
        <div class="card p-3">

          <h3>Redes sociales</h3>

          ${socials.map(s => `
            <div class="border p-2 mb-2">
              <b>${s.platform}</b>
              <p>${s.url}</p>

              <div class="d-flex gap-2">

                <a class="btn btn-sm btn-warning"
                   href="/dashboard/social/edit/${s.id}">
                  Editar
                </a>

                <a class="btn btn-sm btn-danger"
                   href="/dashboard/social/delete/${s.id}">
                  Borrar
                </a>

              </div>
            </div>
          `).join("")}

          <form method="POST" action="/dashboard/social">
            <input class="form-control mb-2" name="platform" placeholder="plataforma">
            <input class="form-control mb-2" name="url" placeholder="url">
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

export const editProjectForm = async (req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM projects WHERE id=? AND user_id=?",
    [req.params.id, req.session.user.id]
  );

  const p = rows[0];

  res.send(`
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">

  <div class="container mt-4">

    <h3>Editar proyecto</h3>

    <form method="POST" action="/dashboard/project/edit/${p.id}">

      <input class="form-control mb-2" name="title" value="${p.title}">
      <input class="form-control mb-2" name="description" value="${p.description}">

      <button class="btn btn-success">Guardar</button>

    </form>

  </div>
  `);
};

export const editProject = async (req, res) => {
  const { title, description } = req.body;

  await db.query(
    "UPDATE projects SET title=?, description=? WHERE id=? AND user_id=?",
    [title, description, req.params.id, req.session.user.id]
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

export const editSocialForm = async (req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM social_links WHERE id=? AND user_id=?",
    [req.params.id, req.session.user.id]
  );

  const s = rows[0];

  res.send(`
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">

  <div class="container mt-4">

    <h3>Editar red social</h3>

    <form method="POST" action="/dashboard/social/edit/${s.id}">

      <input class="form-control mb-2" name="platform" value="${s.platform}">
      <input class="form-control mb-2" name="url" value="${s.url}">

      <button class="btn btn-success">Guardar</button>

    </form>

  </div>
  `);
};

export const editSocial = async (req, res) => {
  const { platform, url } = req.body;

  await db.query(
    "UPDATE social_links SET platform=?, url=? WHERE id=? AND user_id=?",
    [platform, url, req.params.id, req.session.user.id]
  );

  res.redirect("/dashboard");
};