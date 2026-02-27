const productTemplates = {
  app: {
    sections: [
      "產品概述",
      "目標用戶",
      "核心功能",
      "用戶旅程",
      "非功能需求",
      "時間線",
    ],
    features: ["用戶認證", "主螢幕", "設定", "通知", "離線支援"],
  },
  web: {
    sections: [
      "產品概述",
      "目標用戶",
      "功能列表",
      "頁面結構",
      "API 設計",
      "部署需求",
    ],
    features: ["首頁", "登入/註冊", "產品列表", "詳情頁", "購物車", "結帳"],
  },
  api: {
    sections: [
      "產品概述",
      "目標用戶",
      "API 端點",
      "資料模型",
      "認證機制",
      "錯誤處理",
    ],
    features: ["CRUD 操作", "分頁篩選", "驗證授權", "日誌記錄", "速率限制"],
  },
  plugin: {
    sections: [
      "產品概述",
      "目標用戶",
      "擴展點",
      "配置項",
      "生命周期",
      "發布流程",
    ],
    features: ["鉤子定義", "配置界面", "數據存儲", "主題支援", "多語言"],
  },
};

export async function generatePRD(title, type = "web") {
  const template = productTemplates[type] || productTemplates.web;

  return {
    title,
    type,
    template: template.sections,
    content: {
      overview: {
        description: `${title} 是一個為了解決特定用戶痛點的產品`,
        problem: "描述目標用戶面臨的問題",
        solution: "描述產品如何解決這些問題",
      },
      targetUsers: [
        { segment: "主要用戶", description: "用戶特徵和需求" },
        { segment: "次要用戶", description: "用戶特徵和需求" },
      ],
      features: template.features.map((f) => ({
        name: f,
        priority: "P0",
        description: `${f} 功能描述`,
        acceptanceCriteria: ["功能正常運作", "通過測試"],
      })),
      successMetrics: [
        { metric: "用戶數", target: "10000" },
        { metric: "留存率", target: "30%" },
        { metric: "NPS", target: "40" },
      ],
    },
  };
}
