import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function runCommand(command, workdir = null) {
  const options = workdir ? { cwd: workdir } : {};
  try {
    const { stdout, stderr } = await execAsync(command, options);
    return {
      stdout,
      stderr,
      command,
      exitCode: 0,
    };
  } catch (error) {
    return {
      stdout: error.stdout || "",
      stderr: error.stderr || error.message,
      command,
      exitCode: error.code || 1,
    };
  }
}
