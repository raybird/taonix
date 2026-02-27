export async function analyzeRequest(input) {
  const keywords = {
    schedule: ["排程", "schedule", "定時", "每"],
    memory: ["記憶", "memory", "記得", "之前"],
    task: ["任務", "task", "工作", "做"],
    analysis: ["分析", "分析", "如何", "怎麼"],
  };

  let intent = "general";
  let entities = [];

  for (const [type, words] of Object.entries(keywords)) {
    if (words.some((w) => input.includes(w))) {
      intent = type;
      break;
    }
  }

  return {
    input,
    intent,
    entities,
    confidence: 0.85,
    suggestedActions: getSuggestions(intent),
  };
}

function getSuggestions(intent) {
  const suggestions = {
    schedule: ["建立排程", "查看排程", "取消排程"],
    memory: ["搜尋記憶", "儲存資訊", "清除記憶"],
    task: ["建立任務", "追蹤進度", "完成任務"],
    analysis: ["深入分析", "生成報告", "提供建議"],
  };
  return suggestions[intent] || suggestions.general;
}
