import morgan from "morgan";
import logger from "../config/logger.config.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logsDir = path.join(__dirname, "../logs");

// Create logs directory if it doesn't exist
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Create write streams
const httpLogStream = fs.createWriteStream(
  path.join(logsDir, "http-requests.log"),
  { flags: "a" }
);

// Custom Morgan format
const morganFormat =
  ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms';

// Morgan middleware for HTTP logging
const morganMiddleware = morgan(morganFormat, {
  stream: httpLogStream,
  skip: (req, res) => {
    // Skip health check routes
    return req.path === "/api/health" || req.path === "/";
  },
});

export default morganMiddleware;
