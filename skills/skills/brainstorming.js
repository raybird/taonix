export default {
  name: "brainstorming",
  description: "頭腦風暴 - 探索需求、設計與實作方向",
  triggers: [
    "如何",
    "怎麼做",
    "請幫我",
    "要怎麼",
    "可以怎麼",
    "應該怎麼",
    "幫我規劃",
    "帮我规划",
  ],
  keywords: ["功能", "設計", "架構", "方案", "實現", "實作", "思路"],
  intentTypes: ["feature", "design", "planning"],

  async execute(context) {
    const { input, agents } = context;

    return {
      action: "brainstorming",
      input,
      recommendedAgents: ["explorer", "oracle"],
      questions: [
        "這個需求的目的是什麼？",
        "有沒有現有的解決方案可以參考？",
        "這個功能的核心價值是什麼？",
      ],
      steps: [
        "1. 探索使用者意圖與需求背景",
        "2. 分析現有架構與限制",
        "3. 提出多個解決方案",
        "4. 評估每個方案的優缺點",
      ],
    };
  },
};
