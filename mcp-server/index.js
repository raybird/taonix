import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { blackboard } from "../memory/blackboard.js";
import { agentDispatcher } from "../ai-engine/lib/agent-dispatcher.js";
import { AICaller } from "../ai-engine/lib/ai-caller.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Taonix MCP Server (v16.1.0 - Hardened & Exposed)
 * 正式暴露實體 Agent 工具，實現「即插即用」的協作。
 */
const tools = [
  {
    name: "router_route",
    description: "全能路由工具：根據自然語言意圖自動分配 Agent。",
    inputSchema: {
      type: "object",
      properties: { intent: { type: "string" } },
      required: ["intent"]
    }
  },
  {
    name: "coder_action",
    description: "執行代碼操作：包含讀檔、寫檔、運行指令。",
    inputSchema: {
      type: "object",
      properties: {
        action: { type: "string", enum: ["read", "write", "run"] },
        path: { type: "string" },
        content: { type: "string" },
        command: { type: "string" }
      },
      required: ["action"]
    }
  },
  {
    name: "oracle_action",
    description: "執行架構分析：包含結構掃描、依賴檢查、優化建議。",
    inputSchema: {
      type: "object",
      properties: {
        action: { type: "string", enum: ["structure", "deps", "suggest"] },
        directory: { type: "string", default: "." }
      },
      required: ["action"]
    }
  },
  {
    name: "explorer_action",
    description: "執行搜尋任務：取得 GitHub 趨勢或搜尋網頁事實。",
    inputSchema: {
      type: "object",
      properties: {
        action: { type: "string", enum: ["github-trending", "web-search"] },
        query: { type: "string" },
        language: { type: "string" }
      },
      required: ["action"]
    }
  }
];

class TaonixServer {
  constructor() {
    this.server = new Server(
      { name: "taonix-mcp-server", version: "16.1.0" },
      { capabilities: { tools: {} } }
    );
    this.setupHandlers();
  }

  setupHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      let agent, task, params = args;

      if (name === "router_route") {
        // 沿用先前的語義路由邏輯 (簡化示意)
        return { content: [{ type: "text", text: "請直接使用具體的 agent_action 工具以獲得更扎實的執行。" }] };
      }

      // 提取 Agent 名稱
      agent = name.split("_")[0];
      task = args.action;

      // 實體分發執行 (P0 閉環)
      const res = await agentDispatcher.dispatch({ agent, task, params });

      // 注入黑板事實摘要
      const context = blackboard.getSummaryForContext();

      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            success: res.success,
            taskId: res.taskId,
            output: res.output?.substring(0, 1000),
            system_context: context
          }, null, 2)
        }]
      };
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
  }
}

new TaonixServer().run();
