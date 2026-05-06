import express from "express";
import {
  dashboard,
  addProject,
  deleteProject,
  addSocial,
  deleteSocial,
  updateProfile
} from "./controller.js";

import { auth } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", auth, dashboard);

router.post("/project", auth, addProject);
router.get("/project/delete/:id", auth, deleteProject);

router.post("/social", auth, addSocial);
router.get("/social/delete/:id", auth, deleteSocial);

router.post("/profile", auth, updateProfile);

export default router;