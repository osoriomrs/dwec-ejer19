import express from "express";
import {
  dashboard,
  addProject,
  deleteProject,
  editProjectForm,
  editProject,
  addSocial,
  deleteSocial,
  editSocialForm,
  editSocial,
  updateProfile
} from "./controller.js";

import { auth } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", auth, dashboard);

router.post("/profile", auth, updateProfile);

router.post("/project", auth, addProject);
router.get("/project/delete/:id", auth, deleteProject);
router.get("/project/edit/:id", auth, editProjectForm);
router.post("/project/edit/:id", auth, editProject);

router.post("/social", auth, addSocial);
router.get("/social/delete/:id", auth, deleteSocial);
router.get("/social/edit/:id", auth, editSocialForm);
router.post("/social/edit/:id", auth, editSocial);

export default router;