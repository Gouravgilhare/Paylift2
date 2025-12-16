import logger from "../config/logger.config.js";

// Log all API requests
export const requestLogger = (req, res, next) => {
  const startTime = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - startTime;
    const logLevel = res.statusCode >= 400 ? "warn" : "info";

    logger.log(logLevel, "HTTP Request", {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userId: req.user?.userId || "anonymous",
    });
  });

  next();
};

// Log authentication events
export const authLogger = (action, userId, details = {}) => {
  logger.info("Auth Event", {
    action,
    userId,
    timestamp: new Date().toISOString(),
    ...details,
  });
};

// Log database operations
export const dbLogger = (action, table, details = {}) => {
  logger.info("Database Operation", {
    action,
    table,
    timestamp: new Date().toISOString(),
    ...details,
  });
};

// Log errors
export const errorLogger = (error, context = {}) => {
  logger.error("Application Error", {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    ...context,
  });
};
