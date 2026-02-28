export default {
  name: "security-audit",
  description: "安全審計 - 識別程式碼安全漏洞與風險",
  triggers: [
    "安全",
    "漏洞",
    "審計",
    "資安",
    "XSS",
    "SQL injection",
    "權限",
    "認證",
    "加密",
  ],
  keywords: [
    "安全",
    "漏洞",
    "審計",
    "資安",
    "audit",
    "security",
    "vulnerability",
  ],
  intentTypes: ["security", "review"],

  async execute(context) {
    const { input, agents } = context;

    return {
      action: "security-audit",
      input,
      recommendedAgents: ["reviewer", "oracle"],
      checks: [
        "輸入驗證 - 檢查所有使用者輸入",
        "認證與授權 - 驗證權限控制",
        "敏感資料 - 檢查機敏資訊處理",
        "依賴漏洞 - 檢查已知漏洞",
        "API 安全 - 檢查 API 端點保護",
      ],
      steps: [
        "1. 分析程式碼中的輸入點",
        "2. 檢查身份驗證機制",
        "3. 審查權限控制邏輯",
        "4. 檢測敏感資料暴露風險",
        "5. 檢查第三方依賴安全性",
      ],
    };
  },
};
