import {
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreate: (
    title: string,
    description: string,
    priority: string,
    dueDate: string
  ) => Promise<void>;
  loading: boolean;
};

export default function CreateTaskModal({
  open,
  onClose,
  onCreate,
  loading,
}: Props) {
  const [title, setTitle] =
    useState("");

  const [
    description,
    setDescription,
  ] = useState("");

  const [priority, setPriority] =
    useState("MEDIUM");

  const [dueDate, setDueDate] =
    useState("");

  async function handleSubmit() {
    if (!title.trim()) return;

    await onCreate(
      title,
      description,
      priority,
      dueDate
    );

    setTitle("");
    setDescription("");
    setPriority("");
    setDueDate("");

    onClose();
  }

  return (
    <Dialog
      open={open}
      as="div"
      className="relative z-50"
      onClose={onClose}
    >
      {/* BACKDROP */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />

      {/* CONTAINER */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl">
          <DialogTitle className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">
            Create Task
          </DialogTitle>

          <div className="space-y-4">
            <input
              value={title}
              onChange={(e) =>
                setTitle(
                  e.target.value
                )
              }
              placeholder="Task title"
              className="w-full rounded-xl border border-slate-700 bg-slate-100 dark:bg-slate-800 p-3 text-slate-900 dark:text-white outline-none"
            />

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              placeholder="Description"
              rows={4}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-slate-900 dark:text-white outline-none"
            />

            <select
              value={priority}
              onChange={(e) =>
                setPriority(e.target.value)
              }
              className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-slate-900 dark:text-white outline-none"
            >
              <option value="LOW">
                Low Priority
              </option>

              <option value="MEDIUM">
                Medium Priority
              </option>

              <option value="HIGH">
                High Priority
              </option>
            </select>

            <input
              type="date"
              value={dueDate}
              onChange={(e) =>
                setDueDate(e.target.value)
              }
              className="w-full rounded-xl border border-slate-700 bg-slate-100 dark:bg-slate-800 p-3 text-slate-900 dark:text-white outline-none"
            />

            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={onClose}
                className="rounded-xl bg-slate-700 px-5 py-2 font-semibold text-slate-900 dark:text-white transition hover:bg-slate-600"
              >
                Cancel
              </button>

              <button
                disabled={loading}
                onClick={
                  handleSubmit
                }
                className="rounded-xl bg-blue-500 px-5 py-2 font-semibold text-slate-900 dark:text-white transition hover:bg-blue-600"
              >
                {loading
                  ? "Creating..."
                  : "Create"}
              </button>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}