export default {
  name: "doc-generator",
  description: "文檔生成 - 自動生成 API 文件、README、註解",
  triggers: [
    "文件",
    "文檔",
    "說明",
    "註解",
    "生成文件",
    "寫文件",
    "API 文件",
    "readme",
  ],
  keywords: ["文件", "文檔", "說明", "註解", "doc", "readme", "documentation"],
  intentTypes: ["documentation", "writing"],

  async execute(context) {
    const { input, agents } = context;

    return {
      action: "doc-generator",
      input,
      recommendedAgents: ["reviewer", "oracle"],
      docTypes: [
        "README.md - 專案說明文件",
        "API.md - API 接口文檔",
        "CHANGELOG.md - 版本變更記錄",
        "CONTRIBUTING.md - 貢獻指南",
        "CODE_OF_CONDUCT.md - 行為規範",
      ],
      steps: [
        "1. 分析專案結構與代碼",
        "2. 識別需要文檔化的模組",
        "3. 生成 API 接口文檔",
        "4. 產生使用範例",
        "5. 整合至現有文檔結構",
      ],
      recommendations: [
        "使用 JSDoc 註解標準",
        "保持 API 文檔與代碼同步",
        "提供實際可運行的範例",
      ],
    };
  },
};
