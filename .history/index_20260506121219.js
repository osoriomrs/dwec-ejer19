import express from "express";
import session from "express-session";

import userRoutes from "./users/routes.js";
import portfolioRoutes from "./portfolio/routes.js";
import dashboardRoutes from "./dashboard/routes.js";

const app = express();

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

/* VERCEL */
export default app;