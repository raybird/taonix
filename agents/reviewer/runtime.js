import { checkQuality } from "./lib/quality-checker.js";
import { checkFormat } from "./lib/format-checker.js";
import { checkLogic } from "./lib/logic-checker.js";

export async function executeTask(taskSpec, context = {}) {
  const capability = taskSpec.capability || taskSpec.intent || taskSpec.task;
  const args = taskSpec.args || {};
  const filepath = args.filepath || "ai-engine/index.js";

  switch (capability) {
    case "check_quality":
    case "quality":
      return await checkQuality(filepath);
    case "check_format":
    case "format":
      return await checkFormat(filepath);
    case "check_logic":
    case "logic":
      return await checkLogic(filepath);
    default:
      throw new Error(`Unsupported reviewer capability: ${capability}`);
  }
}
