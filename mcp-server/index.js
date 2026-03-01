import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { blackboard } from "../memory/blackboard.js";
import { agentDispatcher } from "../ai-engine/lib/agent-dispatcher.js";
import { AICaller } from "../ai-engine/lib/ai-caller.js";

/**
 * Taonix MCP Server (v16.3.0 - Hub Recovery)
 * 回歸「多智能體樞紐」精神：對外僅暴露統一指揮入口。
 */
const tools = [
  {
    name: "taonix_hub",
    description: "Taonix 智慧樞紐：處理所有工程、搜尋、設計與分析任務。你只需提供意圖，樞紐會自動調度內部 Agent 完成並回報。",
    inputSchema: {
      type: "object",
      properties: {
        intent: { type: "string", description: "你的任務意圖（如：分析此專案結構、修復 index.js 的錯誤、取得 GitHub 今日熱門）" },
        context_hint: { type: "string", description: "額外的上下文線索" }
      },
      required: ["intent"]
    }
  }
];

class TaonixHubServer {
  constructor() {
    this.server = new Server(
      { name: "taonix-hub", version: "16.3.0" },
      { capabilities: { tools: {} } }
    );
    this.aiCaller = new AICaller();
    this.setupHandlers();
  }

  setupHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      if (name === "taonix_hub") {
        console.log(`[Hub] 接收到外部意圖: ${args.intent}`);
        
        // 1. 內部智慧路由 (Internal Routing - 不對外暴露)
        const routingPrompt = `你是一個專業的任務調度器。請根據意圖選擇最合適的 Agent：explorer, coder, oracle, reviewer, designer。\n意圖: ${args.intent}\n僅返回 Agent 名稱。`;
        const routeRes = await this.aiCaller.call(routingPrompt);
        const targetAgent = routeRes.content.trim().toLowerCase();

        // 2. 內部執行 (Dispatcher)
        const execRes = await agentDispatcher.dispatch({
          agent: targetAgent,
          task: args.intent,
          params: {}
        });

        // 3. 彙整結果 (Encapsulation)
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              status: execRes.success ? "completed" : "failed",
              insight: execRes.output?.substring(0, 2000),
              message: "任務已由 Taonix 樞紐處理完畢。"
            }, null, 2)
          }]
        };
      }

      throw new Error("未知工具");
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
  }
}

new TaonixHubServer().run();
