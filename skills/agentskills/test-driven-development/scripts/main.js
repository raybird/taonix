export default {
  name: "test-driven-development",
  description: "測試驅動開發 - RED GREEN REFACTOR 流程",
  triggers: [
    "測試",
    "test",
    "unit test",
    "單元測試",
    "寫測試",
    "新增功能",
    "implement",
  ],
  keywords: [
    "tdd",
    "測試優先",
    "red green",
    "單元測試",
    "整合測試",
    "jest",
    "vitest",
    "pytest",
  ],
  intentTypes: ["feature", "implementation", "test"],
  requiredAgents: ["coder"],

  async execute(context) {
    const { input } = context;

    return {
      action: "test-driven-development",
      input,
      workflow: [
        {
          stage: "RED",
          description: "寫一個失敗的測試",
          steps: ["定義預期行為", "撰寫失敗的測試案例", "確認測試紅燈"],
        },
        {
          stage: "GREEN",
          description: "讓測試通過",
          steps: ["撰寫最小實作通過測試", "不使用完美程式碼", "專注讓測試變綠"],
        },
        {
          stage: "REFACTOR",
          description: "重構程式碼",
          steps: ["改善程式碼品質", "移除重複程式碼", "保持測試通過"],
        },
      ],
      recommendedAgents: ["coder", "reviewer"],
      checks: ["測試覆蓋率", "邊界條件", "錯誤處理"],
    };
  },
};
