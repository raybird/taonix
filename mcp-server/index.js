import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { knowledgeBridge } from "../agents/assistant/lib/knowledge-bridge.js";

const tools = [
  {
    name: "router_route",
    description:
      "Taonix 路由工具 - 統一的 MCP 入口。根據自然語言意圖，自動分發到對應的專業 Agent。支援：搜尋資訊、讀寫檔案、執行指令、程式碼審查、架構分析、UI/UX 設計、產品規劃、測試生成等。",
    inputSchema: {
      type: "object",
      properties: {
        intent: {
          type: "string",
          description:
            "自然語言意圖描述（如：'搜尋 GitHub 趨勢'、'分析這個檔案'、'生成 UI'）",
        },
        action: {
          type: "string",
          description:
            "具體動作 (auto|search|read|write|execute|review|analyze|design|plan|test)",
          default: "auto",
        },
        params: {
          type: "object",
          description: "額外參數",
        },
      },
      required: ["intent"],
    },
  },
];

class TaonixServer {
  constructor() {
    this.server = new Server(
      { name: "taonix-mcp-server", version: "1.8.0" },
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
          case "router_route":
            const intent = args.intent.toLowerCase();
            const action = args.action || "auto";
            let targetTool = "";
            if (action !== "auto") {
              targetTool = action;
            } else {
              if (
                intent.includes("搜尋") ||
                intent.includes("趨勢") ||
                intent.includes("github") ||
                intent.includes("trending")
              ) {
                targetTool = "explorer";
              } else if (
                intent.includes("讀取") ||
                intent.includes("讀檔") ||
                intent.includes("查看")
              ) {
                targetTool = "coder_read";
              } else if (
                intent.includes("寫入") ||
                intent.includes("寫檔") ||
                intent.includes("建立檔案")
              ) {
                targetTool = "coder_write";
              } else if (
                intent.includes("執行") ||
                intent.includes("指令") ||
                intent.includes("command")
              ) {
                targetTool = "coder_exec";
              } else if (
                intent.includes("審查") ||
                intent.includes("review") ||
                intent.includes("檢視")
              ) {
                targetTool = "reviewer";
              } else if (
                intent.includes("架構") ||
                intent.includes("結構") ||
                intent.includes("依賴") ||
                intent.includes("分析")
              ) {
                targetTool = "oracle";
              } else if (
                intent.includes("ui") ||
                intent.includes("設計") ||
                intent.includes("ux") ||
                intent.includes("介面")
              ) {
                targetTool = "designer";
              } else if (
                intent.includes("產品") ||
                intent.includes("需求") ||
                intent.includes("prd") ||
                intent.includes("故事")
              ) {
                targetTool = "product";
              } else if (intent.includes("測試") || intent.includes("test")) {
                targetTool = "tester";
              } else {
                targetTool = "explorer";
              }
            }
            // 知識注入 (Knowledge Injection)
            const relatedKnowledge = [];
            try {
              const allKnowledgeKeys = knowledgeBridge.list();
              for (const key of allKnowledgeKeys) {
                if (intent.includes(key.split(":")[1]) || key.toLowerCase().includes(targetTool)) {
                  const data = knowledgeBridge.get(key);
                  if (data) relatedKnowledge.push({ key, ...data });
                }
              }
            } catch (e) {
              console.error("[KnowledgeInjection] 錯誤:", e.message);
            }

            result = {
              intent: args.intent,
              routed_to: targetTool,
              action: action,
              message: `已根據意圖 "${args.intent}" 路由到 ${targetTool} Agent`,
              knowledge_injection: relatedKnowledge,
              note: "Router 已將請求分發並注入相關知識。實際執行需要調用對應的內部 Agent CLI。",
            };
            break;
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
