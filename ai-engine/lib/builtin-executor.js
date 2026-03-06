import { executeTask as executeExplorerTask } from "../../agents/explorer/runtime.js";
import { executeTask as executeOracleTask } from "../../agents/oracle/runtime.js";
import { executeTask as executeReviewerTask } from "../../agents/reviewer/runtime.js";

export async function executeBuiltInTask(taskSpec) {
  try {
    switch (taskSpec.capability) {
      case "github_trending":
        return {
          success: true,
          data: await executeExplorerTask(taskSpec),
          meta: { source: "builtin-explorer" },
        };
      case "web_search":
        return {
          success: true,
          data: await executeExplorerTask(taskSpec),
          meta: { source: "builtin-explorer" },
        };
      case "analyze_structure":
        return {
          success: true,
          data: await executeOracleTask(taskSpec),
          meta: { source: "builtin-oracle" },
        };
      case "check_quality":
        return {
          success: true,
          data: await executeReviewerTask(taskSpec),
          meta: { source: "builtin-reviewer" },
        };
      default:
        return {
          success: false,
          error: `Unsupported built-in capability: ${taskSpec.capability}`,
        };
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}
