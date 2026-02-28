export async function log(level, message, data = null) {
  const levels = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  };

  const logEntry = {
    timestamp: new Date().toISOString(),
    level: level || "info",
    message,
    data,
  };

  console.log(formatLog(logEntry));

  return logEntry;
}

export async function logTask(task, status, details = null) {
  return await log("info", `[${status.toUpperCase()}] ${task}`, details);
}

export async function logError(error, context = null) {
  const errorEntry = {
    timestamp: new Date().toISOString(),
    level: "error",
    message: error.message || String(error),
    stack: error.stack,
    context,
  };

  console.error(formatLog(errorEntry));

  return errorEntry;
}

export async function logPerformance(operation, duration) {
  return await log("info", `Performance: ${operation}`, {
    duration: `${duration}ms`,
  });
}

function formatLog(entry) {
  const { timestamp, level, message, ...rest } = entry;
  const extras = Object.keys(rest).length > 0 ? JSON.stringify(rest) : "";
  return `[${timestamp}] ${level.toUpperCase()}: ${message} ${extras}`;
}

export async function getRecentLogs(count = 10) {
  return {
    logs: [],
    count: 0,
    note: "Logs are printed to console in current implementation",
  };
}
