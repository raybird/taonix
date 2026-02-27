import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function runCommand(command, workdir = null) {
  const options = workdir ? { cwd: workdir } : {};
  const { stdout, stderr } = await execAsync(command, options);
  return {
    stdout,
    stderr,
    command,
  };
}
