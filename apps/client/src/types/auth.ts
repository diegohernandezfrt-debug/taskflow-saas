export type User = {
  id: string;
  name: string;
  email: string;
  role: "OWNER" | "ADMIN" | "MEMBER";
  workspaceId: string;
};

export type LoginResponse = {
  message: string;
  token: string;
  user: User;
};