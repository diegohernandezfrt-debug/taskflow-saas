import express, { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import {
  create,
  list,
  remove,
  update,
} from "../controllers/project.controller.js";

const router: Router =
  express.Router();

router.post("/", requireAuth, create);
router.get("/", requireAuth, list);

router.patch(
  "/:id",
  requireAuth,
  update
);

router.delete(
  "/:id",
  requireAuth,
  remove
);

export default router;