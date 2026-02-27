export async function analyzeFeature(featureName, description = "") {
  const analysis = {
    name: featureName,
    description,
    complexity: estimateComplexity(featureName, description),
    dependencies: findDependencies(featureName),
    risks: identifyRisks(featureName),
    suggestions: [],
  };

  analysis.suggestions = generateSuggestions(analysis);

  return analysis;
}

function estimateComplexity(name, desc) {
  const complexKeywords = [
    "payment",
    "authentication",
    "real-time",
    "analytics",
    "export",
  ];
  const simpleKeywords = ["display", "list", "view", "search"];

  const text = (name + " " + desc).toLowerCase();

  if (complexKeywords.some((k) => text.includes(k))) return "high";
  if (simpleKeywords.some((k) => text.includes(k))) return "low";
  return "medium";
}

function findDependencies(name) {
  const dependencyMap = {
    auth: ["用戶系統", "session 管理", "權限控制"],
    payment: ["訂單系統", "庫存管理", "發票系統"],
    notification: ["消息隊列", "推送服務", "郵件服務"],
    search: ["搜索引擎", "緩存層", "索引服務"],
  };

  const key = Object.keys(dependencyMap).find((k) =>
    name.toLowerCase().includes(k),
  );
  return key ? dependencyMap[key] : ["基礎設施"];
}

function identifyRisks(name) {
  const risks = [];

  if (name.toLowerCase().includes("payment")) {
    risks.push({ level: "high", description: "需要考慮安全性合規" });
  }
  if (name.toLowerCase().includes("real-time")) {
    risks.push({ level: "medium", description: "需要考慮並發和性能" });
  }
  if (
    name.toLowerCase().includes("import") ||
    name.toLowerCase().includes("export")
  ) {
    risks.push({ level: "low", description: "需要處理大檔案邊界情況" });
  }

  return risks;
}

function generateSuggestions(analysis) {
  const suggestions = [];

  if (analysis.complexity === "high") {
    suggestions.push("建議分階段開發，先實現核心功能");
    suggestions.push("需要詳細的技術評審");
  }

  if (analysis.dependencies.length > 2) {
    suggestions.push("需要先完成依賴的功能");
  }

  suggestions.push("建議先做原型驗證");
  suggestions.push("需要收集用戶回饋");

  return suggestions;
}
