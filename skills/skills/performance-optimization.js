export default {
  name: "performance-optimization",
  description: "效能優化 - 分析並改善程式效能瓶頸",
  triggers: [
    "效能",
    "優化",
    "效能瓶頸",
    "速度",
    "效能調校",
    "優化建議",
    "慢",
    "卡",
  ],
  keywords: [
    "效能",
    "優化",
    "performance",
    "optimization",
    "speed",
    "bottleneck",
  ],
  intentTypes: ["optimization", "performance"],

  async execute(context) {
    const { input, agents } = context;

    return {
      action: "performance-optimization",
      input,
      recommendedAgents: ["oracle", "reviewer"],
      areas: [
        "演算法複雜度 - O(n) 優化至 O(log n)",
        "資料庫查詢 - N+1 問題、索引優化",
        "快取策略 - 減少重複計算",
        "資源載入 - 懶載入、代碼分割",
        "記憶體使用 - 避免記憶體洩漏",
      ],
      steps: [
        "1. 建立效能基準線",
        "2. 使用 Profiler 識別瓶頸",
        "3. 分析熱點程式碼",
        "4. 實作優化方案",
        "5. 驗證效能提升",
      ],
      tools: [
        "Node.js: 0x, clinic.js",
        "Browser: Chrome DevTools",
        "Database: EXPLAIN, 查詢分析",
      ],
    };
  },
};
