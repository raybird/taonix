export async function executeCommand(command) {
  const { exec } = await import("child_process");

  return new Promise((resolve) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        resolve({
          success: false,
          error: error.message,
          output: stderr,
        });
        return;
      }
      resolve({
        success: true,
        output: stdout,
        exitCode: 0,
      });
    });
  });
}

export async function checkSystemStatus() {
  const { exec } = await import("child_process");

  const commands = ["uptime", "df -h", "free -m"];

  const results = {};

  for (const cmd of commands) {
    const output = await new Promise((resolve) => {
      exec(cmd, (err, stdout) => resolve(stdout || err?.message || ""));
    });
    results[cmd] = output;
  }

  return {
    timestamp: new Date().toISOString(),
    ...results,
  };
}

export async function getFileInfo(filepath) {
  const fs = await import("fs/promises");
  const path = await import("path");

  try {
    const stats = await fs.stat(filepath);
    return {
      exists: true,
      size: stats.size,
      created: stats.birthtime,
      modified: stats.mtime,
      isDirectory: stats.isDirectory(),
      isFile: stats.isFile(),
    };
  } catch (error) {
    return {
      exists: false,
      error: error.message,
    };
  }
}
