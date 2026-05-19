import { Request, Response } from "express";
import {
  createTask,
  deleteTask,
  getProjectTasks,
  updateTask,
} from "../services/task.service.js";

export async function create(req: Request, res: Response) {
  try {
    const { title, description, priority, dueDate, projectId } = req.body;

    const task = await createTask({
      title,
      description,
      priority,
      dueDate,
      projectId,
    });

    res.status(201).json({
      message: "Task created",
      task,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Internal server error";

    res.status(400).json({ message });
  }
}

export async function list(req: Request, res: Response) {
  try {
    const { projectId } = req.params;

    const tasks = await getProjectTasks(projectId);

    res.json({
      tasks,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Internal server error";

    res.status(400).json({ message });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const task = await updateTask({
      id: req.params.id,
      ...req.body,
    });

    res.json({
      message: "Task updated",
      task,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Internal server error";

    res.status(400).json({ message });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    await deleteTask(req.params.id);

    res.json({
      message: "Task deleted",
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Internal server error";

    res.status(400).json({ message });
  }
}