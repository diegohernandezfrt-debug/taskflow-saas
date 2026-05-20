import { prisma } from "../lib/prisma.js";

type CreateTaskInput = {
  title: string;
  description?: string;
  priority: string;
  dueDate: string;
  projectId: string;
};

export async function createTask(data: CreateTaskInput) {
  const task = await prisma.task.create({
    data: {
      title: data.title,
      description: data.description,
      priority: data.priority,
      dueDate: data.dueDate
      ? new Date(data.dueDate)
        : null,
      projectId: data.projectId,
    },
  });

  return task;
}

export async function getProjectTasks(projectId: string) {
  return prisma.task.findMany({
    where: {
      projectId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

type UpdateTaskInput = {
  id: string;
  title?: string;
  description?: string;
  status?: "TODO" | "IN_PROGRESS" | "DONE";
  dueDate?: string;
};

export async function updateTask(
  taskId: string,
  data: any
) {
  return prisma.task.update({
    where: {
      id: taskId,
    },
    data,
  });
}

export async function deleteTask(id: string) {
  await prisma.task.delete({
    where: {
      id,
    },
  });
}