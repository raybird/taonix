export default {
  name: "systematic-debugging",
  description: "系統化除錯 - 4 階段根因分析",
  triggers: [
    "bug",
    "錯誤",
    "error",
    "fail",
    "失敗",
    "壞了",
    "不工作",
    "壞掉",
    "問題",
    "fix",
    "修復",
  ],
  keywords: [
    "除錯",
    "debug",
    "問題",
    "崩潰",
    "crash",
    "exception",
    "stack",
    "trace",
  ],
  intentTypes: ["bug", "error", "debug"],
  requiredAgents: ["coder"],

  async execute(context) {
    const { input, project } = context;

    return {
      action: "systematic-debugging",
      input,
      phases: [
        {
          phase: 1,
          name: "重現問題",
          steps: [
            "收集錯誤訊息與堆疊追蹤",
            "確認錯誤發生的條件",
            "建立最小重現案例",
          ],
        },
        {
          phase: 2,
          name: "定位根因",
          steps: ["分析錯誤訊息關鍵字", "檢查相關程式碼", "找出問題源頭"],
        },
        {
          phase: 3,
          name: "制定修復方案",
          steps: ["評估修復方案影響範圍", "選擇最小侵入式修復", "準備測試案例"],
        },
        {
          phase: 4,
          name: "驗證修復",
          steps: ["執行單元測試", "確認錯誤已修復", "檢查是否引入新問題"],
        },
      ],
      recommendedAgents: ["coder", "reviewer"],
    };
  },
};
