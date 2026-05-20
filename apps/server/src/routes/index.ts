import express from "express";
import healthRoute from "./health.route.js";
import authRoute from "./auth.route.js";

const router = express.Router();

router.use("/health", healthRoute);
router.use("/api/auth", authRoute);

export default router;