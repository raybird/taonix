export default {
  name: "verification-before-completion",
  description: "完成前驗證",
  triggers: [
    "完成",
    "done",
    "完成",
    "結束",
    "submit",
    "commit",
    "發布",
    "release",
  ],
  keywords: ["驗證", "確認", "檢查", "通過", "正確"],
  intentTypes: ["complete", "release"],

  async execute(context) {
    const { input } = context;

    return {
      action: "verification-before-completion",
      input,
      checks: [
        {
          category: "程式碼品質",
          items: ["Lint 通過", "型別檢查通過", "無 console.log"],
        },
        {
          category: "測試",
          items: ["單元測試通過", "整合測試通過", "手動測試完成"],
        },
        {
          category: "文件",
          items: ["README 更新", "API 文件同步", "變更日誌"],
        },
        {
          category: "安全",
          items: ["無敏感資訊", "依賴無漏洞", "權限正確"],
        },
      ],
      recommendedAgents: ["reviewer"],
    };
  },
};
