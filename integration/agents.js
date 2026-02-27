import { createClient } from "./client.js";

export class TaonixAgent {
  constructor(name, tools, mcpPath = "./mcp-server/index.js") {
    this.name = name;
    this.tools = tools;
    this.mcpPath = mcpPath;
    this.client = null;
  }

  async initialize() {
    this.client = await createClient(this.mcpPath);
    return this;
  }

  async execute(toolName, args) {
    if (!this.client) {
      await this.initialize();
    }
    const result = await this.client.callTool(toolName, args);
    return result;
  }

  async close() {
    if (this.client) {
      await this.client.disconnect();
    }
  }
}

export const agents = {
  explorer: new TaonixAgent("小探", [
    "explorer_github_trending",
    "explorer_web_search",
  ]),
  coder: new TaonixAgent("小碼", [
    "coder_read_file",
    "coder_write_file",
    "coder_list_files",
    "coder_run_command",
    "coder_code_review",
  ]),
  oracle: new TaonixAgent("小析", [
    "oracle_analyze_structure",
    "oracle_analyze_dependencies",
    "oracle_suggest_architecture",
  ]),
  reviewer: new TaonixAgent("把關", [
    "reviewer_check_quality",
    "reviewer_check_format",
    "reviewer_check_logic",
  ]),
};

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log("Taonix Agents - 已定義");
  Object.keys(agents).forEach((key) => {
    console.log(`- ${agents[key].name}: ${agents[key].tools.length} 個工具`);
  });
}
