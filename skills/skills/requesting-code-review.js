export default {
  name: "requesting-code-review",
  description: "請求程式碼審查",
  triggers: [
    "review",
    "審查",
    "檢查",
    "幫我看",
    "幫我檢查",
    "pull request",
    "pr",
    "merge",
  ],
  keywords: ["code review", "審查", "檢視", "確認"],
  intentTypes: ["review", "merge"],

  async execute(context) {
    const { input } = context;

    return {
      action: "requesting-code-review",
      input,
      checklist: [
        "功能完整性",
        "程式碼風格一致",
        "錯誤處理完善",
        "測試通過",
        "文件更新",
        "無敏感資訊洩露",
      ],
      steps: [
        "1. 自審一次程式碼",
        "2. 確認測試通過",
        "3. 準備變更說明",
        "4. 指定審查者",
        "5. 追蹤回饋處理",
      ],
      recommendedAgents: ["reviewer", "coder"],
    };
  },
};
