import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { currentWorkspace } from "../controllers/workspace.controller.js";

const router = Router();

router.get("/current", requireAuth, currentWorkspace);

export default router;