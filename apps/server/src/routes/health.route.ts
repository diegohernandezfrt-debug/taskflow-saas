import express from "express";

const router = express.Router();

router.get("/", (_req, res) => {
  res.json({
    status: "ok",
    service: "TaskFlow API",
  });
});

export default router;