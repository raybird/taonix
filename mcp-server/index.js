import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { knowledgeBridge } from "../agents/assistant/lib/knowledge-bridge.js";
import { AICaller } from "../ai-engine/lib/ai-caller.js";
import { collaborationLogger } from "../agents/assistant/lib/collaboration-logger.js";
import { blackboard } from "../memory/blackboard.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOG_PATH = path.resolve(__dirname, "..", ".data", "mcp_logs.json");

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

function logMCP(data) {
  try {
    let logs = [];
    const dir = path.dirname(LOG_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    
    if (fs.existsSync(LOG_PATH)) {
      logs = JSON.parse(fs.readFileSync(LOG_PATH, "utf-8"));
    }
    logs.unshift({ timestamp: new Date().toISOString(), ...data });
    fs.writeFileSync(LOG_PATH, JSON.stringify(logs.slice(0, 50), null, 2));
  } catch (e) {
    console.error("[MCPLog] 錯誤:", e.message);
  }
}

class TaonixServer {
  constructor() {
    this.server = new Server(
      { name: "taonix-mcp-server", version: "1.9.0" },
      { capabilities: { tools: {} } },
    );
    this.aiCaller = new AICaller();
    this.semanticCache = new Map();

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
            let routingMethod = "keyword";

            // 1. 優先執行關鍵字路由
            if (action !== "auto") {
              targetTool = action;
            } else {
              if (
                intent.includes("搜尋") || intent.includes("趨勢") ||
                intent.includes("github") || intent.includes("trending")
              ) {
                targetTool = "explorer";
              } else if (
                intent.includes("讀取") || intent.includes("讀檔") || intent.includes("查看")
              ) {
                targetTool = "coder_read";
              } else if (
                intent.includes("寫入") || intent.includes("寫檔") || intent.includes("建立檔案")
              ) {
                targetTool = "coder_write";
              } else if (
                intent.includes("執行") || intent.includes("指令") || intent.includes("command")
              ) {
                targetTool = "coder_exec";
              } else if (
                intent.includes("審查") || intent.includes("review") || intent.includes("檢視")
              ) {
                targetTool = "reviewer";
              } else if (
                intent.includes("架構") || intent.includes("結構") || intent.includes("依賴") || intent.includes("分析")
              ) {
                targetTool = "oracle";
              } else if (
                intent.includes("ui") || intent.includes("設計") || intent.includes("ux") || intent.includes("介面")
              ) {
                targetTool = "designer";
              } else if (
                intent.includes("產品") || intent.includes("需求") || intent.includes("prd") || intent.includes("故事")
              ) {
                targetTool = "product";
              } else if (intent.includes("測試") || intent.includes("test")) {
                targetTool = "tester";
              }
            }

            // 2. 關鍵字匹配失敗或不明確時，啟動語義路由 (Semantic Routing)
            if (!targetTool) {
              routingMethod = "semantic";
              if (this.semanticCache.has(intent)) {
                targetTool = this.semanticCache.get(intent);
                routingMethod = "semantic_cache";
              } else {
                const prompt = `你是一個專業的任務調度器。請根據使用者的意圖，從以下 Agent 清單中選擇最合適的一個。僅返回 Agent 名稱（如: explorer, coder_read, reviewer 等）：\n\n意圖: ${intent}\n\nAgent 清單: explorer (搜尋), coder_read (讀檔), coder_write (寫檔), coder_exec (執行), reviewer (審查), oracle (分析), designer (設計), product (產品), tester (測試)`;
                const aiResult = await this.aiCaller.call(prompt);
                if (!aiResult.error) {
                  const aiAgent = aiResult.content.trim().toLowerCase();
                  if (aiAgent.includes("explorer")) targetTool = "explorer";
                  else if (aiAgent.includes("read")) targetTool = "coder_read";
                  else if (aiAgent.includes("write")) targetTool = "coder_write";
                  else if (aiAgent.includes("exec")) targetTool = "coder_exec";
                  else if (aiAgent.includes("review")) targetTool = "reviewer";
                  else if (aiAgent.includes("oracle") || aiAgent.includes("分析")) targetTool = "oracle";
                  else if (aiAgent.includes("designer") || aiAgent.includes("設計")) targetTool = "designer";
                  else if (aiAgent.includes("product") || aiAgent.includes("產品")) targetTool = "product";
                  else if (aiAgent.includes("tester") || aiAgent.includes("測試")) targetTool = "tester";
                  
                  if (targetTool) this.semanticCache.set(intent, targetTool);
                }
              }
            }

            if (!targetTool) targetTool = "explorer";

            // 3. 知識注入 (Knowledge Injection)
            const relatedKnowledge = [];
            // 注入舊版知識橋接器資料
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

            // 注入 v4.2.0 黑板推理鏈路
            const blackboardSummary = blackboard.getSummaryForContext();
            relatedKnowledge.push({
              key: "shared_blackboard_context",
              type: "reasoning_chain",
              content: blackboardSummary
            });

            result = {
              intent: args.intent,
              routed_to: targetTool,
              routing_method: routingMethod,
              action: action,
              message: `已根據意圖 "${args.intent}" (${routingMethod}) 路由到 ${targetTool} Agent`,
              knowledge_injection: relatedKnowledge,
              note: "Router 已完成語義分析與知識注入。實際執行需要調用對應的內部 Agent CLI。",
            };
            logMCP(result);
            
            // 記錄協作事件
            collaborationLogger.logEvent(`task_${Date.now()}`, "router", "handover", {
              intent: args.intent,
              to: targetTool,
              method: routingMethod
            });
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
