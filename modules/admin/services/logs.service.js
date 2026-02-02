import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logsDir = path.join(__dirname, "../../../logs");

/**
 * Get list of available log files
 */
export const getAvailableLogFiles = () => {
  try {
    if (!fs.existsSync(logsDir)) {
      return [];
    }
    
    const files = fs.readdirSync(logsDir);
    return files
      .filter(file => file.endsWith('.log'))
      .map(file => {
        const stats = fs.statSync(path.join(logsDir, file));
        return {
          name: file,
          size: stats.size,
          modified: stats.mtime
        };
      });
  } catch (error) {
    throw new Error(`Failed to get log files: ${error.message}`);
  }
};

/**
 * Read log file with pagination
 */
export const readLogFile = (filename, options = {}) => {
  try {
    const { lines = 100, offset = 0 } = options;
    const filePath = path.join(logsDir, filename);

    // Security check: prevent path traversal
    if (!filePath.startsWith(logsDir)) {
      throw new Error("Invalid file path");
    }

    if (!fs.existsSync(filePath)) {
      throw new Error(`Log file ${filename} not found`);
    }

    const fileContent = fs.readFileSync(filePath, "utf-8");
    const allLines = fileContent.split("\n").filter(line => line.trim());

    // Get total count
    const total = allLines.length;

    // Apply pagination
    const startIndex = Math.max(0, total - offset - lines);
    const endIndex = Math.max(0, total - offset);
    const logLines = allLines.slice(startIndex, endIndex).reverse();

    return {
      logs: logLines,
      total,
      offset,
      lines: logLines.length
    };
  } catch (error) {
    throw new Error(`Failed to read log file: ${error.message}`);
  }
};

/**
 * Get recent logs from a specific log file
 */
export const getRecentLogs = (logType = "combined", limit = 50) => {
  try {
    const filename = `${logType}.log`;
    return readLogFile(filename, { lines: limit, offset: 0 });
  } catch (error) {
    throw new Error(`Failed to get recent logs: ${error.message}`);
  }
};

/**
 * Clear a specific log file
 */
export const clearLogFile = (filename) => {
  try {
    const filePath = path.join(logsDir, filename);

    // Security check: prevent path traversal
    if (!filePath.startsWith(logsDir)) {
      throw new Error("Invalid file path");
    }

    if (!fs.existsSync(filePath)) {
      throw new Error(`Log file ${filename} not found`);
    }

    fs.writeFileSync(filePath, "");
    return { success: true, message: `Log file ${filename} cleared` };
  } catch (error) {
    throw new Error(`Failed to clear log file: ${error.message}`);
  }
};
