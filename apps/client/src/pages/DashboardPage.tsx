import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import KanbanColumn from "../components/KanbanColumn";
import { toast } from "sonner";
import CreateTaskModal from "../components/CreateTaskModal";
import AnalyticsCharts from "../components/AnalyticsCharts";
import { useTheme } from "../contexts/ThemeContext";

import {
  createProject,
  deleteProject,
  getProjects,
  updateProject,
} from "../services/project.service";

import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from "../services/task.service";

import {
  DndContext,
  closestCorners,
} from "@dnd-kit/core";

import type { Project } from "../types/project";
import type { Task } from "../types/task";

type Status =
  | "TODO"
  | "IN_PROGRESS"
  | "DONE";

export default function DashboardPage() {
  const { user, logout } =
    useAuth();

  const [projects, setProjects] =
    useState<Project[]>([]);

  const [selectedProject, setSelectedProject] =
    useState<Project | null>(null);

  const [tasks, setTasks] =
    useState<Task[]>([]);

  const [projectName, setProjectName] =
    useState("");
  
  const [creatingProject, setCreatingProject] =
    useState(false);

  const [creatingTask, setCreatingTask] =
    useState(false);

  const [taskModalOpen, setTaskModalOpen] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [priorityFilter, setPriorityFilter] =
    useState("ALL");

  const [sortBy, setSortBy] =
    useState("NEWEST");

  const [editingTaskId, setEditingTaskId] =
  useState<string | null>(null);

  const [editingTitle, setEditingTitle] =
    useState("");
  
  const [
  editingProjectId,
  setEditingProjectId,
] = useState<string | null>(
  null
);

const [
  editingProjectName,
  setEditingProjectName,
] = useState("");

  const { theme, toggleTheme } =
    useTheme();

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      loadTasks(selectedProject.id);
    }
  }, [selectedProject]);

  async function loadProjects() {
    const data =
      await getProjects();

    setProjects(data);

    if (data.length) {
      setSelectedProject(data[0]);
    }
  }

  async function loadTasks(
    projectId: string
  ) {
    const data =
      await getTasks(projectId);

    setTasks(data);
  }

  async function handleCreateProject() {
    if (!projectName.trim())
      return;

    try {
      setCreatingProject(true);

      await createProject(
        projectName
      );

      toast.success(
        "Project created"
      );

      setProjectName("");

      await loadProjects();
    } catch {
      toast.error(
        "Failed to create project"
      );
    } finally {
      setCreatingProject(false);
    }
  }

  async function handleEditProject(
    projectId: string
  ) {
    if (
      !editingProjectName.trim()
    )
      return;

    try {
      await updateProject(
        projectId,
        editingProjectName
      );

      toast.success(
        "Project updated"
      );

      await loadProjects();

      setEditingProjectId(
        null
      );

      setEditingProjectName(
        ""
      );
    } catch {
      toast.error(
        "Failed to update project"
      );
    }
  }

  async function handleDeleteProject(
    projectId: string
  ) {
    const confirmed =
      window.confirm(
        "Delete this project and all its tasks?"
      );

    if (!confirmed) return;

    try {
      await deleteProject(
        projectId
      );

      toast.success(
        "Project deleted"
      );

      const updatedProjects =
        projects.filter(
          (project) =>
            project.id !==
            projectId
        );

      setProjects(
        updatedProjects
      );

      if (
        selectedProject?.id ===
        projectId
      ) {
        setSelectedProject(
          updatedProjects[0] ||
            null
        );
      }
    } catch {
      toast.error(
        "Failed to delete project"
      );
    }
  }

  async function handleCreateTask(
    title: string,
    description: string,
    priority: string,
    dueDate: string
  ) {
    if (!selectedProject)
      return;

    try {
      setCreatingTask(true);

      await createTask(
        title,
        description,
        priority,
        dueDate,
        selectedProject.id
      );

      toast.success(
        "Task created"
      );

      await loadTasks(
        selectedProject.id
      );
    } catch {
      toast.error(
        "Failed to create task"
      );
    } finally {
      setCreatingTask(false);
    }
  }

  async function moveTask(
    taskId: string,
    status: Status
  ) {
    await updateTask(taskId, {
      status,
    });

    if (selectedProject) {
      await loadTasks(
        selectedProject.id
      );
    }
  }

  async function handleDragEnd(
    event: any
  ) {
    const { active, over } = event;

    if (!over) return;

    const taskId = active.id;
    const newStatus = over.id as Status;

    const task = tasks.find(
      (t) => t.id === taskId
    );

    toast.success("Task moved");

    if (!task) return;

    if (task.status === newStatus)
      return;

    // UPDATE UI INSTANT
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: newStatus,
            }
          : task
      )
    );

    // UPDATE DB
    await updateTask(taskId, {
      status: newStatus,
    });
  }

  async function handleEditTask(
  taskId: string
) {
  if (!editingTitle.trim())
    return;

  const updatedTask =
    await updateTask(taskId, {
      title: editingTitle,
    });

    toast.success("Task updated");

  setTasks((prev) =>
    prev.map((task) =>
      task.id === taskId
        ? updatedTask
        : task
    )
  );

  setEditingTaskId(null);
  setEditingTitle("");
}

  async function handleDeleteTask(
    taskId: string
  ) {
    const confirmed =
      window.confirm(
        "Delete this task?"
      );

    if (!confirmed) return;

    await deleteTask(taskId);

    toast.success(
      "Task deleted"
    );

    if (selectedProject) {
      await loadTasks(
        selectedProject.id
      );
    }
  }

  const filteredTasks =
    tasks
      .filter((task) => {
        const matchesSearch =
          task.title
            .toLowerCase()
            .includes(
              search.toLowerCase()
            );

        const matchesPriority =
          priorityFilter === "ALL"
            ? true
            : task.priority ===
              priorityFilter;

        return (
          matchesSearch &&
          matchesPriority
        );
      })
      .sort((a, b) => {
        if (sortBy === "NEWEST") {
          return (
            new Date(
              b.createdAt || ""
            ).getTime() -
            new Date(
              a.createdAt || ""
            ).getTime()
          );
        }

        if (sortBy === "OLDEST") {
          return (
            new Date(
              a.createdAt || ""
            ).getTime() -
            new Date(
              b.createdAt || ""
            ).getTime()
          );
        }

        return 0;
      });

  const todo =
    filteredTasks.filter(
      (t) =>
        t.status === "TODO"
    );

  const inProgress =
    tasks.filter(
      (t) =>
        t.status ===
        "IN_PROGRESS"
    );

  const done =
    tasks.filter(
      (t) =>
        t.status === "DONE"
    );

  const totalTasks =
    filteredTasks.length;

  const completedTasks =
    done.length;

  const pendingTasks =
    totalTasks - completedTasks;

  const progress =
    totalTasks === 0
      ? 0
      : Math.round(
          (completedTasks /
            totalTasks) *
            100
        );

  return (
    <div className="flex min-h-screen flex-col bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-white lg:flex-row">
      {/* SIDEBAR */}
      <aside className="flex w-full flex-col border-b border-slate-200 bg-slate-100 p-6 text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-white lg:h-screen lg:w-72 lg:border-b-0 lg:border-r">
        <h1 className="mb-8 text-3xl font-bold text-blue-400">
          TaskFlow
        </h1>

        <div className="mb-8">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Logged in as
          </p>

          <p className="font-semibold">
            {user?.name}
          </p>
        </div>

        <div className="mb-8">
          <h2 className="mb-3 text-sm font-semibold text-slate-500 dark:text-slate-400">
            CREATE PROJECT
          </h2>

          <div className="space-y-2">
            <input
              value={projectName}
              onChange={(e) =>
                setProjectName(
                  e.target.value
                )
              }
              placeholder="Project name"
              className="w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />

            <button
              disabled={creatingProject}
              onClick={
                handleCreateProject
              }
              className="w-full rounded-lg bg-blue-500 p-3 font-semibold transition hover:bg-blue-600"
            >
              {creatingProject
                ? "Creating..."
                : "Create"}
            </button>
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-sm font-semibold text-slate-500 dark:text-slate-400">
            PROJECTS
          </h2>

          <div className="space-y-2">
            {projects.map((project) => (
              <div
                key={project.id}
                className={`rounded-xl p-2 transition ${
                  selectedProject?.id ===
                  project.id
                    ? "bg-blue-500"
                    : "bg-slate-200 dark:bg-slate-800"
                }`}
              >
                {editingProjectId ===
                project.id ? (
                  <div className="space-y-2">
                    <input
                      value={
                        editingProjectName
                      }
                      onChange={(e) =>
                        setEditingProjectName(
                          e.target.value
                        )
                      }
                      className="w-full rounded-lg border border-slate-300 bg-white p-2 text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                    />

                    <button
                      onClick={() =>
                        handleEditProject(
                          project.id
                        )
                      }
                      className="w-full rounded-lg bg-green-500 p-2 font-semibold text-white transition hover:bg-green-600"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-2">
                    <button
                      onClick={() =>
                        setSelectedProject(
                          project
                        )
                      }
                      className={`flex-1 rounded-lg p-2 text-left transition ${
                        selectedProject?.id ===
                        project.id
                          ? "text-white"
                          : "text-slate-900 dark:text-white"
                      }`}
                    >
                      {project.name}
                    </button>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingProjectId(
                            project.id
                          );

                          setEditingProjectName(
                            project.name
                          );
                        }}
                        className="rounded-lg bg-yellow-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-yellow-600"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDeleteProject(
                            project.id
                          )
                        }
                        className="rounded-lg bg-red-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={toggleTheme}
          className="mb-4 w-full rounded-lg bg-slate-300 p-3 font-semibold text-slate-900 transition hover:bg-slate-400 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
        >
          {theme === "dark"
            ? "☀️ Light Mode"
            : "🌙 Dark Mode"}
        </button>

        <button
          onClick={logout}
          className="mt-auto w-full rounded-lg bg-red-500 p-3 font-semibold transition hover:bg-red-600"
        >
          Logout
        </button>
      </aside>

      {/* MAIN */}
      <main className="flex-1 overflow-hidden p-8">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-3xl font-bold">
              {selectedProject?.name}
            </h2>

            <p className="text-slate-500 dark:text-slate-400">
              Project dashboard
            </p>
          </div>

          <div className="flex flex-col gap-3 md:flex-row">
            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search tasks..."
              className="w-full md:w-auto rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm text-slate-900 dark:text-white outline-none"
            />

            <select
              value={priorityFilter}
              onChange={(e) =>
                setPriorityFilter(
                  e.target.value
                )
              }
              className="rounded-w-full md:w-auto border bg-white dark:bg-slate-800
                      text-slate-900 dark:text-white
                      border-slate-300 dark:border-slate-700"
            >
              <option value="ALL">
                All Priorities
              </option>

              <option value="LOW">
                Low
              </option>

              <option value="MEDIUM">
                Medium
              </option>

              <option value="HIGH">
                High
              </option>
            </select>

            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value)
              }
              className="w-full md:w-auto border border-slate-700 bg-slate-100 dark:bg-slate-800 px-4 py-3 text-sm outline-none"
            >
              <option value="NEWEST">
                Newest
              </option>

              <option value="OLDEST">
                Oldest
              </option>
            </select>
          </div>

          <button
            onClick={() =>
              setTaskModalOpen(true)
            }
            className="rounded-xl bg-blue-500 px-5 py-3 font-semibold transition hover:bg-blue-600"
          >
            + Add Task
          </button>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {/* TOTAL */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Total Tasks
            </p>

            <h3 className="mt-2 text-3xl font-bold">
              {totalTasks}
            </h3>
          </div>

          {/* COMPLETED */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Completed
            </p>

            <h3 className="mt-2 text-3xl font-bold text-green-400">
              {completedTasks}
            </h3>
          </div>

          {/* PENDING */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Pending
            </p>

            <h3 className="mt-2 text-3xl font-bold text-yellow-400">
              {pendingTasks}
            </h3>
          </div>

          {/* PROGRESS */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Progress
            </p>

            <h3 className="mt-2 text-3xl font-bold text-blue-400">
              {progress}%
            </h3>

            <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className="h-full rounded-full bg-blue-500 transition-all"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>
          </div>
        </div>

        <AnalyticsCharts
          tasks={filteredTasks}
        />

        <DndContext
          collisionDetection={closestCorners}
          onDragEnd={handleDragEnd}
        >
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <KanbanColumn
            title="TODO"
            tasks={todo}
            moveTask={moveTask}
            next="IN_PROGRESS"
            deleteTask={handleDeleteTask}
            editingTaskId={editingTaskId}
            editingTitle={editingTitle}
            setEditingTaskId={setEditingTaskId}
            setEditingTitle={setEditingTitle}
            handleEditTask={handleEditTask}
            status="TODO"
          />

          <KanbanColumn
            title="IN PROGRESS"
            tasks={inProgress}
            moveTask={moveTask}
            next="DONE"
            deleteTask={handleDeleteTask}
            editingTaskId={editingTaskId}
            editingTitle={editingTitle}
            setEditingTaskId={setEditingTaskId}
            setEditingTitle={setEditingTitle}
            handleEditTask={handleEditTask}
            status="IN_PROGRESS"
          />

          <KanbanColumn
            title="DONE"
            tasks={done}
            deleteTask={handleDeleteTask}
            editingTaskId={editingTaskId}
            editingTitle={editingTitle}
            setEditingTaskId={setEditingTaskId}
            setEditingTitle={setEditingTitle}
            handleEditTask={handleEditTask}
            status="DONE"
          />
        </div>
        </DndContext>

          <CreateTaskModal
            open={taskModalOpen}
            onClose={() =>
              setTaskModalOpen(false)
            }
            onCreate={handleCreateTask}
            loading={creatingTask}
          />

      </main>
    </div>
  );
}
