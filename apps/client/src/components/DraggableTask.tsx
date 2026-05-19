import {
  useDraggable,
} from "@dnd-kit/core";

import {
  CSS,
} from "@dnd-kit/utilities";

import type { Task } from "../types/task";

type Status =
  | "TODO"
  | "IN_PROGRESS"
  | "DONE";

type Props = {
  task: Task;
  next?: Status;
  moveTask?: (
    id: string,
    status: Status
  ) => void;
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
};

export default function DraggableTask({
  task,
  next,
  moveTask,
  deleteTask,
  editingTaskId,
  editingTitle,
  setEditingTaskId,
  setEditingTitle,
  handleEditTask,
}: Props) {

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
  } = useDraggable({
    id: task.id,
  });

  const style = {
    transform:
      CSS.Translate.toString(
        transform
      ),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="rounded-xl border border-slate-800 bg-slate-950 p-4 shadow-lg transition hover:border-blue-500 active:cursor-grabbing"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        {editingTaskId === task.id ? (
          <input
            value={editingTitle}
            onChange={(e) =>
              setEditingTitle(
                e.target.value
              )
            }
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-2 outline-none"
          />
        ) : (
          <h4 className="font-semibold">
            {task.title}
          </h4>
        )}

        <span className="rounded-full bg-slate-800 px-2 py-1 text-xs text-slate-400">
          {task.status}
        </span>
      </div>

      <p className="mb-5 text-sm text-slate-400">
        {task.description ||
          "No description"}
      </p>

      <div className="flex gap-2">
        {editingTaskId === task.id ? (
          <button
            onClick={() =>
              handleEditTask(task.id)
            }
            className="flex-1 rounded-lg bg-green-500 px-4 py-2 text-sm font-semibold transition hover:bg-green-600"
          >
            Save
          </button>
        ) : (
          <button
            onClick={() => {
              setEditingTaskId(
                task.id
              );

              setEditingTitle(
                task.title
              );
            }}
            className="rounded-lg bg-yellow-500 px-4 py-2 text-sm font-semibold transition hover:bg-yellow-600"
          >
            Edit
          </button>
        )}

        {next && (
          <button
            onClick={() =>
              moveTask?.(
                task.id,
                next
              )
            }
            className="flex-1 rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold transition hover:bg-blue-600"
          >
            Move
          </button>
        )}

        <button
          onClick={() =>
            deleteTask?.(task.id)
          }
          className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold transition hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
}