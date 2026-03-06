import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { run } from "../ai-engine/index.js";
import { semanticValidator } from "../ai-engine/lib/semantic-validator.js";

/**
 * Taonix MCP Server (v26.0.0 - Runtime Convergence)
 * 樞紐 3.0：單一控制面，統一委派至 TaonixAI。
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
      { name: "taonix-hub", version: "26.0.0" },
      { capabilities: { tools: {} } }
    );
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

        // 2. 單一控制面：一律交給 TaonixAI
        const execRes = await run(args.intent);

        return {
          content: [{
            type: "text",
            text: JSON.stringify(execRes, null, 2)
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
