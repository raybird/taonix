const uiTemplates = {
  mobile: {
    layout: "單欄式佈局，流動式寬度",
    navigation: "底部導航欄 (Tab Bar)",
    header: "固定頂部 Header，含返回按鈕",
    content: "卡片式內容區塊",
  },
  desktop: {
    layout: "多欄式佈局，固定最大寬度 1440px",
    navigation: "側邊導航欄 (Sidebar)",
    header: "頂部 Header，含搜尋和使用者資訊",
    content: "網格系統 (Grid) 排列",
  },
  dashboard: {
    layout: "側邊欄 + 頂部 Header + 主內容區",
    navigation: "可折疊側邊欄",
    header: "麵包屑 + 通知 + 使用者選單",
    content: "儀表板卡片 + 圖表區域",
  },
};

export async function generateUI(type, colorPalette = "default") {
  const template = uiTemplates[type] || uiTemplates.desktop;

  const colorPalettes = {
    default: {
      primary: "#3B82F6",
      secondary: "#64748B",
      accent: "#10B981",
      background: "#FFFFFF",
      surface: "#F8FAFC",
    },
    dark: {
      primary: "#60A5FA",
      secondary: "#94A3B8",
      accent: "#34D399",
      background: "#0F172A",
      surface: "#1E293B",
    },
    warm: {
      primary: "#F59E0B",
      secondary: "#D97706",
      accent: "#EF4444",
      background: "#FFFBEB",
      surface: "#FEF3C7",
    },
  };

  return {
    type,
    layout: template,
    colors: colorPalettes[colorPalette] || colorPalettes.default,
    recommendations: [
      "使用一致的間距系統 (4px base)",
      "確保觸控區域至少 44x44px",
      "保持視覺層次清晰",
      "提供無障礙支援",
    ],
  };
}
