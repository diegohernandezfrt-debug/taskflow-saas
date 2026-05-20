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

export async function updateProject(
  projectId: string,
  name: string
) {
  return prisma.project.update({
    where: {
      id: projectId,
    },
    data: {
      name,
    },
  });
}

export async function deleteProject(
  projectId: string
) {
  return prisma.project.delete({
    where: {
      id: projectId,
    },
  });
}