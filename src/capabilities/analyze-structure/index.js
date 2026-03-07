import { analyzeStructure } from "./lib/analyze-structure.js";

export const capability = {
  name: "analyze_structure",
  description: "Analyze repository or directory structure.",
  inputSchema: {
    type: "object",
    properties: {
      directory: { type: "string" },
    },
  },
  outputSchema: {
    type: "object",
    properties: {
      directory: { type: "string" },
      tree: { type: "object" },
      fileCount: { type: "number" },
      dirCount: { type: "number" },
    },
  },
  executionMode: "in_process",
  sideEffects: ["filesystem:read"],
  keywords: ["結構", "结构", "架構", "architecture", "structure", "repo", "repository", "project"],
  async handler(taskSpec) {
    return analyzeStructure(taskSpec.args.directory || taskSpec.target || ".");
  },
};

export default capability;
