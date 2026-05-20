import { Request, Response } from "express";
import {
  createProject,
  deleteProject,
  getProjects,
  updateProject,
} from "../services/project.service.js";

export async function create(req: Request, res: Response) {
  try {
    const { name, description } = req.body;

    const project = await createProject({
      userId: req.user!.id,
      name,
      description,
    });

    res.status(201).json({
      message: "Project created",
      project,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Internal server error";

    res.status(400).json({
      message,
    });
  }
}

export async function list(req: Request, res: Response) {
  try {
    const projects = await getProjects(req.user!.id);

    res.json({
      projects,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Internal server error";

    res.status(400).json({
      message,
    });
  }
}

export async function update(
  req: Request,
  res: Response
) {
  try {
    const { name } = req.body;
    const project =
      await updateProject(
        String(req.params.id),
        name
      );

    res.json({
      message:
        "Project updated",
      project,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Internal server error";

    res.status(400).json({
      message,
    });
  }
}

export async function remove(
  req: Request,
  res: Response
) {
  try {
    await deleteProject(
      String(req.params.id)
    );

    res.json({
      message:
        "Project deleted",
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Internal server error";

    res.status(400).json({
      message,
    });
  }
}