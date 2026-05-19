import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

import type { Task } from "../types/task";

type Props = {
  tasks: Task[];
};

const COLORS = [
  "#3b82f6",
  "#eab308",
  "#22c55e",
];

const PRIORITY_COLORS = [
  "#22c55e",
  "#eab308",
  "#ef4444",
];

export default function AnalyticsCharts({
  tasks,
}: Props) {
  const statusData = [
    {
      name: "TODO",
      value: tasks.filter(
        (t) =>
          t.status === "TODO"
      ).length,
    },

    {
      name: "IN PROGRESS",
      value: tasks.filter(
        (t) =>
          t.status ===
          "IN_PROGRESS"
      ).length,
    },

    {
      name: "DONE",
      value: tasks.filter(
        (t) =>
          t.status === "DONE"
      ).length,
    },
  ];

  const priorityData = [
    {
      name: "LOW",
      value: tasks.filter(
        (t) =>
          t.priority === "LOW"
      ).length,
    },

    {
      name: "MEDIUM",
      value: tasks.filter(
        (t) =>
          t.priority ===
          "MEDIUM"
      ).length,
    },

    {
      name: "HIGH",
      value: tasks.filter(
        (t) =>
          t.priority === "HIGH"
      ).length,
    },
  ];

  return (
    <div className="mb-8 grid gap-6 xl:grid-cols-2">
      {/* STATUS CHART */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
        <h3 className="mb-6 text-xl font-bold">
          Tasks Status
        </h3>

        <div className="h-80">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {statusData.map(
                  (_, index) => (
                    <Cell
                      key={index}
                      fill={
                        COLORS[
                          index %
                            COLORS.length
                        ]
                      }
                    />
                  )
                )}
              </Pie>

              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* PRIORITY CHART */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
        <h3 className="mb-6 text-xl font-bold">
          Tasks Priority
        </h3>

        <div className="h-80">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <PieChart>
              <Pie
                data={priorityData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {priorityData.map(
                  (_, index) => (
                    <Cell
                      key={index}
                      fill={
                        PRIORITY_COLORS[
                          index %
                            PRIORITY_COLORS.length
                        ]
                      }
                    />
                  )
                )}
              </Pie>

              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}