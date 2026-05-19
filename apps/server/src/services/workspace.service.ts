import { prisma } from "../lib/prisma.js";

export async function getCurrentWorkspace(userId: string) {
  const membership = await prisma.membership.findFirst({
    where: {
      userId,
    },
    include: {
      workspace: true,
    },
  });

  if (!membership) {
    throw new Error("Workspace not found");
  }

  return membership.workspace;
}