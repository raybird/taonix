import { getGithubTrending } from "./lib/get-github-trending.js";

export const capability = {
  name: "github_trending",
  description: "Fetch GitHub trending repositories.",
  inputSchema: {
    type: "object",
    properties: {
      language: { type: "string" },
    },
  },
  outputSchema: {
    type: "array",
    items: { type: "object" },
  },
  executionMode: "in_process",
  sideEffects: ["network:optional"],
  keywords: ["github", "trending", "熱門", "热门", "trend", "repo"],
  async handler(taskSpec, context = {}) {
    if (typeof context.githubTrending === "function") {
      return context.githubTrending(taskSpec.args.language || "");
    }
    return getGithubTrending(taskSpec.args.language || "");
  },
};

export default capability;
