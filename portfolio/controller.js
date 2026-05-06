import db from "../db/db.js";

const publicMenu = `
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">

<nav class="navbar navbar-dark bg-dark px-3">
  <a class="btn btn-light btn-sm" href="/">Inicio</a>

  <div>
    <a class="btn btn-outline-light btn-sm me-2" href="/login">Login</a>
    <a class="btn btn-outline-success btn-sm" href="/register">Register</a>
  </div>
</nav>
`;

export const portfolio = async (req, res) => {
  const username = req.params.username;

  const [userRows] = await db.query(
    "SELECT * FROM users WHERE username=?",
    [username]
  );

  if (userRows.length === 0) {
    return res.send("<h1>Usuario no encontrado</h1>");
  }

  const user = userRows[0];

  const [projects] = await db.query(
    "SELECT * FROM projects WHERE user_id=?",
    [user.id]
  );

  const [socials] = await db.query(
    "SELECT * FROM social_links WHERE user_id=?",
    [user.id]
  );

  const isOwner =
    req.session.user && req.session.user.id === user.id;

  res.send(`
  ${publicMenu}

  <div class="container mt-4">

    <div class="card p-3 mb-3">

      <h1>${user.username}</h1>
      <p><b>Email:</b> ${user.email}</p>
      <p>${user.bio || "Sin biografía"}</p>

      ${isOwner ? `
        <a class="btn btn-primary mt-2" href="/dashboard">
          Gestionar mi Portafolio
        </a>
      ` : ""}

    </div>

    <div class="row">

      <div class="col-md-6">

        <div class="card p-3">

          <h3>Proyectos</h3>

          ${projects.map(p => `
            <div class="border p-2 mb-2">
              <b>${p.title}</b>
              <p>${p.description}</p>
            </div>
          `).join("")}

        </div>

      </div>

      <div class="col-md-6">

        <div class="card p-3">

          <h3>Redes sociales</h3>

          ${socials.map(s => `
            <p>
              <b>${s.platform}</b>:
              <a href="${s.url}" target="_blank">${s.url}</a>
            </p>
          `).join("")}

        </div>

      </div>

    </div>

  </div>
  `);
};