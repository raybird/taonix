export async function createUserStory(role, action, benefit) {
  const story = {
    asA: role,
    iWantTo: action,
    soThat: benefit,

    acceptanceCriteria: generateAC(role, action),
    storyPoints: estimatePoints(action),
    priority: determinePriority(action),
    tasks: generateTasks(action),
  };

  return story;
}

function generateAC(role, action) {
  const ac = ["功能正確運作", "通過單元測試", "文件已更新"];

  const actionLower = action.toLowerCase();

  if (actionLower.includes("管理") || actionLower.includes("編輯")) {
    ac.push("表單驗證通過");
  }
  if (actionLower.includes("查看") || actionLower.includes("顯示")) {
    ac.push("正確顯示資料");
  }
  if (actionLower.includes("刪除")) {
    ac.push("確認刪除提示");
  }

  return ac;
}

function estimatePoints(action) {
  const actionLower = action.toLowerCase();

  if (actionLower.includes("建立") || actionLower.includes("複雜")) return 8;
  if (actionLower.includes("編輯") || actionLower.includes("多個")) return 5;
  if (actionLower.includes("查看") || actionLower.includes("簡單")) return 2;
  if (actionLower.includes("刪除") || actionLower.includes("列表")) return 3;

  return 3;
}

function determinePriority(action) {
  const actionLower = action.toLowerCase();

  if (actionLower.includes("登入") || actionLower.includes("核心")) return "P0";
  if (actionLower.includes("主要") || actionLower.includes("重要")) return "P1";
  return "P2";
}

function generateTasks(action) {
  return [
    "技術評估",
    "數據庫設計（如需要）",
    "API 開發",
    "前端開發",
    "測試",
    "文檔更新",
  ];
}
