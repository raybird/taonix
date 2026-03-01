import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { blackboard } from "../memory/blackboard.js";
import { agentDispatcher } from "../ai-engine/lib/agent-dispatcher.js";
import { AICaller } from "../ai-engine/lib/ai-caller.js";
import { semanticValidator } from "../ai-engine/lib/semantic-validator.js";

/**
 * Taonix MCP Server (v17.0.0 - Semantic Alignment)
 * 樞紐 2.0：具備語義預審與防禦性調度能力。
 */
const tools = [
  {
    name: "taonix_hub",
    description: "Taonix 智慧樞紐：處理工程、搜尋與分析任務。請提供明確意圖，樞紐將自動驗證並指派專家。",
    inputSchema: {
      type: "object",
      properties: {
        intent: { type: "string", description: "任務意圖" }
      },
      required: ["intent"]
    }
  }
];

class TaonixHubServer {
  constructor() {
    this.server = new Server(
      { name: "taonix-hub", version: "17.0.0" },
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
        console.log(`[Hub] 接收到意圖: ${args.intent}`);
        
        // 1. 語義對齊檢查 (v17.0.0 防禦層)
        const validation = await semanticValidator.validate(args.intent);
        if (!validation.success) {
          return {
            content: [{
              type: "text",
              text: JSON.stringify({
                status: "rejected",
                reason: validation.error,
                guidance: "請參考 Blackboard 的 intent_templates 以提供結構化意圖。"
              }, null, 2)
            }]
          };
        }

        // 2. 內部調度
        const routingPrompt = `你是一個專業的任務調度器。請根據意圖選擇 Agent：explorer, coder, oracle, reviewer。\n意圖: ${args.intent}\n僅返回 Agent 名稱。`;
        const routeRes = await this.aiCaller.call(routingPrompt);
        const targetAgent = routeRes.content.trim().toLowerCase();

        const execRes = await agentDispatcher.dispatch({
          agent: targetAgent,
          task: args.intent,
          params: {}
        });

        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              status: execRes.success ? "completed" : "failed",
              agent_used: targetAgent,
              insight: execRes.output?.substring(0, 1000)
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
