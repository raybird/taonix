import { readFile, writeFile, listFiles } from "./lib/file-operations.js";
import { runCommand } from "./lib/shell-commands.js";

export async function executeTask(taskSpec, context = {}) {
  const capability = taskSpec.capability || taskSpec.intent || taskSpec.task;
  const args = taskSpec.args || {};

  switch (capability) {
    case "read_file":
    case "read":
      return {
        filepath: args.filepath,
        content: await readFile(args.filepath),
      };
    case "write_file":
    case "write":
      await writeFile(args.filepath, args.content || "");
      return {
        filepath: args.filepath,
        action: "write",
      };
    case "list_files":
    case "list":
      return await listFiles(args.directory || ".");
    case "run_command":
    case "run":
      return await runCommand(args.command || "", args.workdir || null);
    default:
      throw new Error(`Unsupported coder capability: ${capability}`);
  }
}
