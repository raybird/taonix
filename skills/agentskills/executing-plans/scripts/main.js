export default {
  name: "executing-plans",
  description: "執行實作計劃",
  triggers: ["執行", "implement", "實作", "開始做", "動工"],
  keywords: ["計劃", "方案", "實作", "開發", "施工"],
  intentTypes: ["implementation"],

  async execute(context) {
    const { input, plan } = context;

    return {
      action: "executing-plans",
      input,
      workflow: [
        "1. 確認計劃完整且可執行",
        "2. 按優先順序分解任務",
        "3. 逐一執行每個任務",
        "4. 每個任務完成後自我驗證",
        "5. 整合所有任務並測試",
        "6. 完成後回顧與記錄",
      ],
      checkpoints: [
        "每個階段完成後的檢查點",
        "遇到問題時回報與調整",
        "完成後的驗收標準確認",
      ],
      recommendedAgents: ["coder", "reviewer"],
    };
  },
};
