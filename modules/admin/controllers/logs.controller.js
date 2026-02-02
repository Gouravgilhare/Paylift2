import * as logsService from "../services/logs.service.js";

/**
 * Get list of available log files
 * GET /api/admin/logs
 */
export const getLogFilesList = async (req, res) => {
  try {
    const logFiles = logsService.getAvailableLogFiles();
    
    res.status(200).json({
      success: true,
      message: "Log files retrieved successfully",
      data: logFiles
    });
  } catch (error) {
    console.error("Error getting log files:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve log files"
    });
  }
};

/**
 * Get logs from a specific log file
 * GET /api/admin/logs/:filename
 */
export const getLogsByFilename = async (req, res) => {
  try {
    const { filename } = req.params;
    const { lines = 100, offset = 0 } = req.query;

    const result = logsService.readLogFile(filename, {
      lines: parseInt(lines),
      offset: parseInt(offset)
    });

    res.status(200).json({
      success: true,
      message: "Logs retrieved successfully",
      data: result
    });
  } catch (error) {
    console.error("Error reading log file:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to read log file"
    });
  }
};

/**
 * Get recent logs from a specific log type
 * GET /api/admin/logs/recent/:type
 */
export const getRecentLogsByType = async (req, res) => {
  try {
    const { type } = req.params;
    const { limit = 50 } = req.query;

    const result = logsService.getRecentLogs(type, parseInt(limit));

    res.status(200).json({
      success: true,
      message: `Recent ${type} logs retrieved successfully`,
      data: result
    });
  } catch (error) {
    console.error("Error getting recent logs:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to get recent logs"
    });
  }
};

/**
 * Clear a specific log file (superadmin only)
 * DELETE /api/admin/logs/:filename
 */
export const clearLogFile = async (req, res) => {
  try {
    // Only superadmin can clear logs
    if (req.user.role !== "superadmin") {
      return res.status(403).json({
        success: false,
        message: "Only superadmin can clear log files"
      });
    }

    const { filename } = req.params;
    const result = logsService.clearLogFile(filename);

    res.status(200).json({
      success: true,
      message: result.message,
      data: result
    });
  } catch (error) {
    console.error("Error clearing log file:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to clear log file"
    });
  }
};
