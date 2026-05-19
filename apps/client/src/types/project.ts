export type Project = {
  id: string;
  name: string;
  description?: string;
  status: "ACTIVE" | "ARCHIVED";
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
};