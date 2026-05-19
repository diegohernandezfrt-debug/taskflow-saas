import type { Task } from "../types/task";
import { useDroppable } from "@dnd-kit/core";
import TaskCard from "./TaskCard";

type Status =
  | "TODO"
  | "IN_PROGRESS"
  | "DONE";

type Props = {
  title: string;
  tasks: Task[];
  moveTask?: (
    id: string,
    status: Status
  ) => void;
  next?: Status;
  deleteTask?: (
    id: string
  ) => void;
  editingTaskId: string | null;
  editingTitle: string;
  setEditingTaskId: (
    id: string | null
  ) => void;
  setEditingTitle: (
    title: string
  ) => void;
  handleEditTask: (
    id: string
  ) => void;
  status: Status;
};

export default function KanbanColumn({
  title,
  tasks,
  moveTask,
  next,
  deleteTask,
  editingTaskId,
  editingTitle,
  setEditingTaskId,
  setEditingTitle,
  handleEditTask,
  status,
}: Props) {
  const { setNodeRef } =
    useDroppable({
      id: status,
    });

  return (
    <div
      ref={setNodeRef}
      className="flex min-h-[500px] flex-col rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
    >
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-slate-200 p-5 dark:border-slate-800">
        <h3 className="text-lg font-bold tracking-wide">
          {title}
        </h3>

        <span className="rounded-full bg-slate-200 px-3 py-1 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-300">
          {tasks.length}
        </span>
      </div>

      {/* TASKS */}
      <div className="flex-1 space-y-4 overflow-y-auto p-5">
        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 py-12 text-center dark:border-slate-700">
            <p className="text-lg font-semibold text-slate-500 dark:text-slate-400">
              No tasks yet
            </p>

            <p className="mt-2 text-sm text-slate-400">
              Create your first task
            </p>
          </div>
        )}

        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            next={next}
            moveTask={moveTask}
            deleteTask={deleteTask}
            editingTaskId={editingTaskId}
            editingTitle={editingTitle}
            setEditingTaskId={setEditingTaskId}
            setEditingTitle={setEditingTitle}
            handleEditTask={handleEditTask}
          />
        ))}
      </div>
    </div>
  );
}