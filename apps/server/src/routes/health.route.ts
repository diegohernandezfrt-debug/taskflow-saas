import express, { Router } from "express";

const router: Router =
  express.Router();

router.get("/", (_req, res) => {
  res.json({
    status: "ok",
    service: "TaskFlow API",
  });
});

export default router;