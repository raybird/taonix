import { checkQuality } from "./lib/check-quality.js";

export const capability = {
  name: "check_quality",
  description: "Check file quality and report simple issues.",
  inputSchema: {
    type: "object",
    properties: {
      filepath: { type: "string" },
    },
  },
  outputSchema: {
    type: "object",
    properties: {
      filepath: { type: "string" },
      score: { type: "number" },
      issues: { type: "object" },
    },
  },
  executionMode: "in_process",
  sideEffects: ["filesystem:read"],
  keywords: ["quality", "品質", "质量", "review", "檢查", "检查"],
  async handler(taskSpec) {
    return checkQuality(taskSpec.args.filepath || "package.json");
  },
};

export default capability;
