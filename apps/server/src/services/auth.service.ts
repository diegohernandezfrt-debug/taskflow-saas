import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma.js";

type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

export async function registerUser(data: RegisterInput) {
  const { name, email, password } = data;

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.$transaction(async (tx) => {
    const createdUser = await tx.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "OWNER",
      },
    });

    const workspace = await tx.workspace.create({
      data: {
        name: `${name} Workspace`,
      },
    });

    await tx.membership.create({
      data: {
        userId: createdUser.id,
        workspaceId: workspace.id,
      },
    });

    return createdUser;
  });

  return user;
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const passwordMatch = await bcrypt.compare(
    password,
    user.password
  );

  if (!passwordMatch) {
    throw new Error("Invalid credentials");
  }

  const membership = await prisma.membership.findFirst({
    where: {
      userId: user.id,
    },
  });

  if (!membership) {
    throw new Error("Membership not found");
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    workspaceId: membership.workspaceId,
  };
}