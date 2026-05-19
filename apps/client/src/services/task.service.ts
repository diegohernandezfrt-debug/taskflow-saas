import { api } from "./api";
import type { Task } from "../types/task";

type TasksResponse = {
  tasks: Task[];
};

export async function getTasks(
  projectId: string
) {
  const response =
    await api.get<TasksResponse>(
      `/tasks/project/${projectId}`
    );

  return response.data.tasks;
}

export async function createTask(
  title: string,
  description: string,
  priority: string,
  dueDate: string,
  projectId: string
) {
  const data = await api.post(
    "/tasks",
    {
      title,
      description,
      priority,
      dueDate,
      projectId,
    }
  );

  return data.data.task;
}

export async function updateTask(
  id: string,
  data: {
    title?: string;
    status?:
      | "TODO"
      | "IN_PROGRESS"
      | "DONE";
    dueDate?: string;
  }
) {
  const response =
    await api.patch(
      `/tasks/${id}`,
      data
    );

  return response.data.task;
}

export async function deleteTask(
  id: string
) {
  await api.delete(`/tasks/${id}`);
}