import express from "express";
import cors from "cors";
import workspaceRoutes from "./routes/workspace.route.js";
import projectRoutes from "./routes/project.route.js";
import taskRoutes from "./routes/task.route.js";

import { env } from "./config/env.js";
import routes from "./routes/index.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

app.use("/", routes);
app.use("/api/workspaces", workspaceRoutes);

app.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT}`);
});