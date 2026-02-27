import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { getGithubTrending } from "../agents/explorer/lib/github-trending.js";
import { searchWeb } from "../agents/explorer/lib/web-search.js";
import {
  readFile,
  writeFile,
  listFiles,
} from "../agents/coder/lib/file-operations.js";
import { runCommand } from "../agents/coder/lib/shell-commands.js";
import { codeReview } from "../agents/coder/lib/code-review.js";
import { analyzeStructure } from "../agents/oracle/lib/structure-analyzer.js";
import { analyzeDependencies } from "../agents/oracle/lib/dependency-analyzer.js";
import { suggestArchitecture } from "../agents/oracle/lib/architecture-suggestion.js";
import { checkQuality } from "../agents/reviewer/lib/quality-checker.js";
import { checkFormat } from "../agents/reviewer/lib/format-checker.js";
import { checkLogic } from "../agents/reviewer/lib/logic-checker.js";

const tools = [
  {
    name: "explorer_github_trending",
    description: "取得 GitHub Trending 專案",
    inputSchema: {
      type: "object",
      properties: {
        language: {
          type: "string",
          description: "篩選語言（如 javascript, python）",
        },
      },
    },
  },
  {
    name: "explorer_web_search",
    description: "搜尋網頁內容",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "搜尋關鍵字" },
        numResults: { type: "number", description: "結果數量", default: 5 },
      },
    },
  },
  {
    name: "coder_read_file",
    description: "讀取檔案內容",
    inputSchema: {
      type: "object",
      properties: {
        filepath: { type: "string", description: "檔案路徑" },
      },
      required: ["filepath"],
    },
  },
  {
    name: "coder_write_file",
    description: "寫入檔案",
    inputSchema: {
      type: "object",
      properties: {
        filepath: { type: "string", description: "檔案路徑" },
        content: { type: "string", description: "檔案內容" },
      },
      required: ["filepath", "content"],
    },
  },
  {
    name: "coder_list_files",
    description: "列出目錄檔案",
    inputSchema: {
      type: "object",
      properties: {
        directory: { type: "string", description: "目錄路徑", default: "." },
      },
    },
  },
  {
    name: "coder_run_command",
    description: "執行指令",
    inputSchema: {
      type: "object",
      properties: {
        command: { type: "string", description: "要執行的指令" },
        workdir: { type: "string", description: "工作目錄" },
      },
      required: ["command"],
    },
  },
  {
    name: "coder_code_review",
    description: "Code Review - 檢視程式碼",
    inputSchema: {
      type: "object",
      properties: {
        filepath: { type: "string", description: "檔案路徑" },
      },
      required: ["filepath"],
    },
  },
  {
    name: "oracle_analyze_structure",
    description: "分析專案結構",
    inputSchema: {
      type: "object",
      properties: {
        directory: { type: "string", description: "專案目錄" },
      },
      required: ["directory"],
    },
  },
  {
    name: "oracle_analyze_dependencies",
    description: "分析專案依賴",
    inputSchema: {
      type: "object",
      properties: {
        directory: { type: "string", description: "專案目錄" },
      },
      required: ["directory"],
    },
  },
  {
    name: "oracle_suggest_architecture",
    description: "提供架構建議",
    inputSchema: {
      type: "object",
      properties: {
        directory: { type: "string", description: "專案目錄" },
      },
      required: ["directory"],
    },
  },
  {
    name: "reviewer_check_quality",
    description: "檢查程式碼品質",
    inputSchema: {
      type: "object",
      properties: {
        filepath: { type: "string", description: "檔案路徑" },
      },
      required: ["filepath"],
    },
  },
  {
    name: "reviewer_check_format",
    description: "檢查程式碼格式",
    inputSchema: {
      type: "object",
      properties: {
        filepath: { type: "string", description: "檔案路徑" },
      },
      required: ["filepath"],
    },
  },
  {
    name: "reviewer_check_logic",
    description: "檢查邏輯一致性",
    inputSchema: {
      type: "object",
      properties: {
        filepath: { type: "string", description: "檔案路徑" },
      },
      required: ["filepath"],
    },
  },
];

class TaonixServer {
  constructor() {
    this.server = new Server(
      { name: "taonix-mcp-server", version: "1.0.0" },
      { capabilities: { tools: {} } },
    );

    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return { tools };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        const { name, arguments: args } = request.params;
        let result;

        switch (name) {
          case "explorer_github_trending":
            result = await getGithubTrending(args.language || "");
            break;
          case "explorer_web_search":
            result = await searchWeb(args.query, args.numResults);
            break;
          case "coder_read_file":
            result = {
              filepath: args.filepath,
              content: await readFile(args.filepath),
            };
            break;
          case "coder_write_file":
            await writeFile(args.filepath, args.content);
            result = {
              success: true,
              message: `File written: ${args.filepath}`,
            };
            break;
          case "coder_list_files":
            result = await listFiles(args.directory || ".");
            break;
          case "coder_run_command":
            result = await runCommand(args.command, args.workdir);
            break;
          case "coder_code_review":
            result = await codeReview(args.filepath);
            break;
          case "oracle_analyze_structure":
            result = await analyzeStructure(args.directory);
            break;
          case "oracle_analyze_dependencies":
            result = await analyzeDependencies(args.directory);
            break;
          case "oracle_suggest_architecture":
            result = await suggestArchitecture(args.directory);
            break;
          case "reviewer_check_quality":
            result = await checkQuality(args.filepath);
            break;
          case "reviewer_check_format":
            result = await checkFormat(args.filepath);
            break;
          case "reviewer_check_logic":
            result = await checkLogic(args.filepath);
            break;
          default:
            throw new Error(`Unknown tool: ${name}`);
        }

        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            { type: "text", text: JSON.stringify({ error: error.message }) },
          ],
        };
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Taonix MCP Server running on stdio");
  }
}

const server = new TaonixServer();
server.run();
