import { getGithubTrending } from "./lib/github-trending.js";
import { searchWeb } from "./lib/web-search.js";

export async function executeTask(taskSpec, context = {}) {
  const capability = taskSpec.capability || taskSpec.intent || taskSpec.task;
  const args = taskSpec.args || {};

  switch (capability) {
    case "github_trending":
    case "github-trending":
      return await getGithubTrending(args.language || "");
    case "web_search":
    case "web-search":
      return await searchWeb(args.query || taskSpec.userInput || "", args.num || 5);
    default:
      throw new Error(`Unsupported explorer capability: ${capability}`);
  }
}
