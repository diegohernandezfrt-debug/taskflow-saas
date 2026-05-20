import express from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import {
  create,
  list,
  remove,
  update,
} from "../controllers/task.controller.js";

const router = express.Router();

router.post("/", requireAuth, create);
router.get("/project/:projectId", requireAuth, list);
router.patch("/:id", requireAuth, update);
router.delete("/:id", requireAuth, remove);

export default router;