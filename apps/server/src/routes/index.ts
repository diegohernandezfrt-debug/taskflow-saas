import express, { Router } from "express";
import healthRoute from "./health.route.js";
import authRoute from "./auth.route.js";

const router: Router =
  express.Router();

router.use("/health", healthRoute);
router.use("/api/auth", authRoute);

export default router;