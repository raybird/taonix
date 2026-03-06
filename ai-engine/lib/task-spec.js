import { getCapability, isBuiltInCapability } from "./capability-registry.js";

export function buildTaskSpec(intent, agents) {
  const primaryAgent = agents?.primary?.agent || intent.agent || "unknown";
  const capability = intent.capability || intent.intent || "unknown";
  const capabilityMeta = getCapability(capability);
  const args = normalizeArgs(intent);

  return {
    id: `task_${Date.now()}`,
    traceId: `trace_${Date.now()}`,
    userInput: intent.input,
    intent: intent.intent,
    capability,
    targetAgent: capabilityMeta?.agent || primaryAgent,
    args,
    executionMode: capabilityMeta?.executionMode || (isBuiltInCapability(capability) ? "builtin" : "skill"),
  };
}

function normalizeArgs(intent) {
  const params = intent.params || {};

  switch (intent.intent) {
    case "github_trending":
      return {
        language: params.language || "",
        timeframe: params.time || "recent",
      };
    case "web_search":
      return {
        query: params.query || inferSearchQuery(intent.input),
        num: 5,
      };
    case "analyze_structure":
      return {
        directory: params.directory || ".",
      };
    case "analyze_deps":
    case "suggest_architecture":
      return {
        directory: params.directory || ".",
      };
    case "check_quality":
    case "check_format":
    case "check_logic":
      return {
        filepath: params.filepath || "ai-engine/index.js",
      };
    case "read_file":
      return {
        filepath: params.filepath || "README.md",
      };
    case "write_file":
      return {
        filepath: params.filepath || "tmp/output.txt",
        content: params.content || "",
      };
    case "list_files":
      return {
        directory: params.directory || ".",
      };
    case "run_command":
      return {
        command: params.command || "pwd",
        workdir: params.workdir || null,
      };
    default:
      return params;
  }
}

function inferSearchQuery(input = "") {
  return input
    .replace(/幫我|請|搜尋|搜索|查詢|查一下|找一下|一下/gu, "")
    .trim() || input;
}
