import express from "express";
import session from "express-session";

import userRoutes from "./users/routes.js";
import portfolioRoutes from "./portfolio/routes.js";
import dashboardRoutes from "./dashboard/routes.js";

const app = express();

app.get("/", (req, res) => {
  res.send(`
    <h1>Portfolio App</h1>
    <a href="/login">Login</a>
    <a href="/register">Register</a>
  `);
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: false
}));

app.use("/", userRoutes);
app.use("/portfolio", portfolioRoutes);
app.use("/dashboard", dashboardRoutes);

app.listen(8080, () => {
  console.log("Servidor en http://localhost:8080");
});

export default app;