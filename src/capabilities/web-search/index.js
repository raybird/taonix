import { searchWeb } from "./lib/search-web.js";

export const capability = {
  name: "web_search",
  description: "Search the web through a mockable search capability.",
  inputSchema: {
    type: "object",
    properties: {
      query: { type: "string" },
      num: { type: "number" },
    },
  },
  outputSchema: {
    type: "array",
    items: { type: "object" },
  },
  executionMode: "in_process",
  sideEffects: ["network:optional"],
  keywords: ["搜尋", "搜索", "search", "news", "資訊", "信息"],
  async handler(taskSpec) {
    return searchWeb(taskSpec.args.query || taskSpec.input, taskSpec.args.num || 5);
  },
};

export default capability;
