import { api } from "./api";

export async function getProjects() {
  const response =
    await api.get("/projects");

  return response.data.projects;
}

export async function createProject(
  name: string
) {
  const response =
    await api.post(
      "/projects",
      {
        name,
        description: "",
        workspaceId:
          localStorage.getItem(
            "workspaceId"
          ),
      }
    );

  return response.data.project;
}

export async function updateProject(
  id: string,
  name: string
) {
  const response =
    await api.patch(
      `/projects/${id}`,
      {
        name,
      }
    );

  return response.data.project;
}

export async function deleteProject(
  id: string
) {
  await api.delete(
    `/projects/${id}`
  );
}