import { agentRegistry } from "./registry.js";

/**
 * 初始化核心 Agent 註冊資料 (v5.0.0)
 */
export function initCoreAgents() {
  console.log("🚀 正在註冊核心 Agent 能力...");

  agentRegistry.register("explorer", {
    capabilities: ["searching", "browsing", "github_trending"],
    description: "滄溟 - 負責資訊檢索與趨勢追蹤"
  });

  agentRegistry.register("coder", {
    capabilities: ["coding", "refactoring", "filesystem"],
    description: "鑄焰 - 負責程式實作與檔案操作"
  });

  agentRegistry.register("tester", {
    capabilities: ["testing", "validation", "ci"],
    description: "試煉 - 負責自動化測試與環境驗證"
  });

  agentRegistry.register("oracle", {
    capabilities: ["analysis", "architecture", "reasoning"],
    description: "明鏡 - 負責深度分析與架構設計"
  });

  agentRegistry.register("assistant", {
    capabilities: ["planning", "coordination", "summarization"],
    description: "助理 - 核心協調與任務規劃"
  });

  console.log("✅ 核心 Agent 註冊完成。");
}

if (import.meta.url === "file://" + process.argv[1]) {
  initCoreAgents();
}
