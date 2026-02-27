const complexityIndicators = {
  high: [
    "architecture",
    "重構",
    "refactor",
    "系統設計",
    "framework",
    "compare",
    "比較",
    "分析",
    "多個",
    "several",
    "multiple",
    "review",
    "審查",
    "完整",
    "full",
    "end-to-end",
    "端到端",
    "implement",
    "實作",
    "build",
    "建立",
    "create system",
  ],
  medium: [
    "debug",
    "除錯",
    "fix",
    "修復",
    "improve",
    "優化",
    "add",
    "新增",
    "功能",
    "feature",
    "test",
    "測試",
    "寫",
    "read",
    "查",
    "找",
    "search",
    "find",
  ],
  low: [
    "什麼",
    "what",
    "how",
    "怎麼",
    "?",
    "是什麼",
    "問",
    "看看",
    "show",
    "list",
    "ls",
    "get",
  ],
};

const complexityAgentMapping = {
  high: ["explorer", "coder", "oracle", "reviewer"],
  medium: ["explorer", "coder"],
  low: ["explorer"],
};

export function analyzeComplexity(input) {
  const text = (input || "").toLowerCase();
  let score = 0;

  for (const keyword of complexityIndicators.high) {
    if (text.includes(keyword.toLowerCase())) score += 3;
  }

  for (const keyword of complexityIndicators.medium) {
    if (text.includes(keyword.toLowerCase())) score += 1;
  }

  for (const keyword of complexityIndicators.low) {
    if (text.includes(keyword.toLowerCase())) score -= 1;
  }

  let level = "low";
  if (score >= 4) level = "high";
  else if (score >= 2) level = "medium";

  return {
    level,
    score,
    agents: complexityAgentMapping[level],
  };
}

export function getComplexityLabel(level) {
  const labels = {
    low: "簡單任務",
    medium: "中等任務",
    high: "複雜任務",
  };
  return labels[level] || "未知";
}

export default { analyzeComplexity, getComplexityLabel };
