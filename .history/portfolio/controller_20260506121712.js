import db from "../db/db.js";

export const portfolio = async (req, res) => {
  const username = req.params.username;

  const [userRows] = await db.query(
    "SELECT * FROM users WHERE username=?",
    [username]
  );

  if (userRows.length === 0) return res.send("Usuario no encontrado");

  const user = userRows[0];

  const [projects] = await db.query(
    "SELECT * FROM projects WHERE user_id=?",
    [user.id]
  );

  const [socials] = await db.query(
    "SELECT * FROM social_links WHERE user_id=?",
    [user.id]
  );

  const isOwner = req.session.user && req.session.user.id === user.id;

  res.send(`
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">

  <nav class="navbar navbar-dark bg-dark px-3">
    <a class="btn btn-light btn-sm" href="/">Inicio</a>
    <a class="btn btn-light btn-sm" href="/dashboard">Dashboard</a>
  </nav>

  <div class="container mt-4">

    <div class="card p-3 mb-3">
      <h2>${user.username}</h2>
      <p>${user.bio || ""}</p>
      <p>${user.email}</p>

      ${isOwner ? `<a class="btn btn-dark" href="/dashboard">Gestionar portafolio</a>` : ""}
    </div>

    <div class="row">

      <div class="col-md-6">
        <div class="card p-3">
          <h3>Redes</h3>
          ${socials.map(s => `
            <p><b>${s.platform}</b> - <a href="${s.url}">${s.url}</a></p>
          `).join("")}
        </div>
      </div>

      <div class="col-md-6">
        <div class="card p-3">
          <h3>Proyectos</h3>
          ${projects.map(p => `
            <p><b>${p.title}</b> - ${p.description}</p>
          `).join("")}
        </div>
      </div>

    </div>

  </div>
  `);
};