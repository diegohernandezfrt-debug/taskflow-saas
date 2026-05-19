import { Request, Response } from "express";
import { getCurrentWorkspace } from "../services/workspace.service.js";

export async function currentWorkspace(
  req: Request,
  res: Response
) {
  try {
    const workspace = await getCurrentWorkspace(
      req.user!.id
    );

    res.json({
      workspace,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Internal server error";

    res.status(404).json({
      message,
    });
  }
}