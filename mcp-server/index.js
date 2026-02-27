import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { getGithubTrending } from "../agents/explorer/lib/github-trending.js";
import { searchWeb } from "../agents/explorer/lib/web-search.js";
import { generateUI } from "../agents/designer/lib/ui-generator.js";
import { generateComponent } from "../agents/designer/lib/component-generator.js";
import { analyzeUX } from "../agents/designer/lib/ux-analyzer.js";
import { generatePRD } from "../agents/product/lib/prd-generator.js";
import { analyzeFeature } from "../agents/product/lib/feature-analyzer.js";
import { createUserStory } from "../agents/product/lib/user-story.js";
import { createTestPlan } from "../agents/tester/lib/test-plan.js";
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
  {
    name: "designer_generate_ui",
    description: "生成 UI 設計建議",
    inputSchema: {
      type: "object",
      properties: {
        type: {
          type: "string",
          description: "類型 (mobile|desktop|dashboard)",
        },
        color: { type: "string", description: "色彩配置", default: "default" },
      },
      required: ["type"],
    },
  },
  {
    name: "designer_generate_component",
    description: "生成元件設計",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "元件名稱" },
        type: { type: "string", description: "類型", default: "card" },
      },
      required: ["name"],
    },
  },
  {
    name: "designer_analyze_ux",
    description: "分析 UX 流程",
    inputSchema: {
      type: "object",
      properties: {
        directory: { type: "string", description: "專案目錄" },
      },
      required: ["directory"],
    },
  },
  {
    name: "product_generate_prd",
    description: "生成產品需求文檔",
    inputSchema: {
      type: "object",
      properties: {
        title: { type: "string", description: "產品標題" },
        type: { type: "string", description: "產品類型", default: "web" },
      },
      required: ["title"],
    },
  },
  {
    name: "product_analyze_feature",
    description: "分析功能需求",
    inputSchema: {
      type: "object",
      properties: {
        feature: { type: "string", description: "功能名稱" },
        description: { type: "string", description: "功能描述" },
      },
      required: ["feature"],
    },
  },
  {
    name: "product_create_story",
    description: "生成使用者故事",
    inputSchema: {
      type: "object",
      properties: {
        role: { type: "string", description: "使用者角色" },
        action: { type: "string", description: "想要做什麼" },
        benefit: { type: "string", description: "獲得什麼價值" },
      },
      required: ["role", "action", "benefit"],
    },
  },
  {
    name: "tester_create_plan",
    description: "生成測試計劃",
    inputSchema: {
      type: "object",
      properties: {
        feature: { type: "string", description: "功能名稱" },
        description: { type: "string", description: "功能描述" },
      },
      required: ["feature"],
    },
  },
];

class TaonixServer {
  constructor() {
    this.server = new Server(
      { name: "taonix-mcp-server", version: "1.6.0" },
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
          case "designer_generate_ui":
            result = await generateUI(args.type, args.color || "default");
            break;
          case "designer_generate_component":
            result = await generateComponent(args.name, args.type || "card");
            break;
          case "designer_analyze_ux":
            result = await analyzeUX(args.directory);
            break;
          case "product_generate_prd":
            result = await generatePRD(args.title, args.type || "web");
            break;
          case "product_analyze_feature":
            result = await analyzeFeature(args.feature, args.description || "");
            break;
          case "product_create_story":
            result = await createUserStory(
              args.role,
              args.action,
              args.benefit,
            );
            break;
          case "tester_create_plan":
            result = await createTestPlan(args.feature, args.description || "");
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
