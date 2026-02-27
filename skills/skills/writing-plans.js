export default {
  name: "writing-plans",
  description: "撰寫實作計劃",
  triggers: ["計劃", "plan", "規劃", "方案", "spec", "規格", "文件"],
  keywords: ["實作", "實現", "開發", "實作計劃", "實作方案"],
  intentTypes: ["planning", "design"],

  async execute(context) {
    const { input } = context;

    return {
      action: "writing-plans",
      input,
      structure: [
        "目標與範圍",
        "現狀分析",
        "解決方案",
        "實作步驟",
        "風險評估",
        "驗收標準",
      ],
      recommendedAgents: ["oracle", "explorer"],
    };
  },
};
