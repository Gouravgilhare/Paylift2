import cluster from "cluster";
import os from "os";
import "./config/env.config.js";
import app from "./app.js";
// Load environment variables
// dotenv.config();

const PORT = process.env.PORT || 5000;
const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  console.log(`🟢 Primary process running PID: ${process.pid}`);
  console.log(`🚀 Starting ${numCPUs} worker processes...\n`);

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Restart a worker if it crashes
  cluster.on("exit", (worker, code, signal) => {
    console.error(
      `❌ Worker crashed (PID: ${worker.process.pid}). Restarting...`
    );
    cluster.fork();
  });
} else {
  // Worker server instance
  const server = app.listen(PORT, () => {
    console.log(
      `🟩 Worker running → PID: ${process.pid} | Listening on port ${PORT}`
    );
  });

  // Graceful shutdown
  const shutdown = () => {
    console.log(`🔻 Worker shutting down (PID: ${process.pid})...`);
    server.close(() => process.exit(0));
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

// Catch unhandled errors to avoid crash
process.on("unhandledRejection", (err) => {
  console.error("🔥 Unhandled Promise Rejection:", err);
});

process.on("uncaughtException", (err) => {
  console.error("🔥 Uncaught Exception:", err);
});
