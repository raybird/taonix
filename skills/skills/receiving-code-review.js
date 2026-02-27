export default {
  name: "receiving-code-review",
  description: "接收程式碼審查回饋",
  triggers: [
    "review",
    "審查",
    "feedback",
    "回饋",
    "意見",
    "建議",
    "critic",
    "comments",
  ],
  keywords: ["code review", "審查意見", "修改建議", "改善", "優化"],
  intentTypes: ["review"],

  async execute(context) {
    const { input } = context;

    return {
      action: "receiving-code-review",
      input,
      steps: [
        "1. 先理解回饋內容，不要急於辯解",
        "2. 區分技術問題與風格問題",
        "3. 技術問題必須驗證並修復",
        "4. 風格問題可選擇性採納",
        "5. 有疑問時主動詢問釐清",
      ],
      principles: ["證據優先於斷言", "驗證後再承認問題", "不情緒化回應"],
      recommendedAgents: ["coder"],
    };
  },
};
