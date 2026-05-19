import { api } from "./api";
import type { LoginResponse } from "../types/auth";

type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

type LoginInput = {
  email: string;
  password: string;
};

export async function register(
  data: RegisterInput
) {
  const response = await api.post(
    "/auth/register",
    data
  );

  return response.data;
}

export async function login(
  data: LoginInput
) {
  const response =
    await api.post<LoginResponse>(
      "/auth/login",
      data
    );

  return response.data;
}

export async function getMe() {
  const response =
    await api.get("/auth/me");

  return response.data.user;
}