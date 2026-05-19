import { prisma } from "../lib/prisma.js";

async function getWorkspaceId(userId: string) {
  const membership = await prisma.membership.findFirst({
    where: {
      userId,
    },
  });

  if (!membership) {
    throw new Error("Workspace not found");
  }

  return membership.workspaceId;
}

type CreateProjectInput = {
  userId: string;
  name: string;
  description?: string;
};

export async function createProject(
  data: CreateProjectInput
) {
  const workspaceId = await getWorkspaceId(data.userId);

  const project = await prisma.project.create({
    data: {
      name: data.name,
      description: data.description,
      workspaceId,
    },
  });

  return project;
}

export async function getProjects(userId: string) {
  const workspaceId = await getWorkspaceId(userId);

  return prisma.project.findMany({
    where: {
      workspaceId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

type UpdateProjectInput = {
  id: string;
  name: string;
};

export async function updateProject(
  data: UpdateProjectInput
) {
  return prisma.project.update({
    where: {
      id: data.id,
    },
    data: {
      name: data.name,
    },
  });
}

export async function deleteProject(
  id: string
) {
  return prisma.project.delete({
    where: {
      id,
    },
  });
}