export async function createTestPlan(featureName, description = "") {
  const plan = {
    feature: featureName,
    description,
    scope: determineScope(featureName),
    testTypes: determineTestTypes(featureName),
    testCases: generateTestCases(featureName),
    environment: {
      browsers: ["Chrome", "Firefox", "Safari"],
      devices: ["Desktop", "Mobile", "Tablet"],
    },
    schedule: {
      estimatedHours: estimateHours(featureName),
      dependencies: findTestDependencies(featureName),
    },
  };

  return plan;
}

function determineScope(name) {
  const scopeMap = {
    login: { units: 10, integration: 5, e2e: 3 },
    payment: { units: 20, integration: 10, e2e: 5 },
    search: { units: 15, integration: 8, e2e: 4 },
    dashboard: { units: 12, integration: 6, e2e: 3 },
  };

  const key = Object.keys(scopeMap).find((k) => name.toLowerCase().includes(k));
  return key ? scopeMap[key] : { units: 8, integration: 4, e2e: 2 };
}

function determineTestTypes(name) {
  const types = ["單元測試", "整合測試"];

  if (
    name.toLowerCase().includes("ui") ||
    name.toLowerCase().includes("介面")
  ) {
    types.push("E2E 測試");
    types.push("視覺回歸測試");
  }

  if (
    name.toLowerCase().includes("api") ||
    name.toLowerCase().includes("接口")
  ) {
    types.push("API 測試");
  }

  if (
    name.toLowerCase().includes("效能") ||
    name.toLowerCase().includes("performance")
  ) {
    types.push("效能測試");
  }

  return types;
}

function generateTestCases(featureName) {
  const cases = [
    {
      id: "TC001",
      title: "正常流程",
      type: "正向",
      priority: "P0",
      steps: ["輸入正確資料", "提交", "驗證結果"],
    },
    {
      id: "TC002",
      title: "錯誤輸入",
      type: "負向",
      priority: "P0",
      steps: ["輸入錯誤資料", "提交", "驗證錯誤提示"],
    },
    {
      id: "TC003",
      title: "邊界情況",
      type: "邊界",
      priority: "P1",
      steps: ["輸入邊界值", "提交", "驗證行為"],
    },
  ];

  return cases;
}

function estimateHours(name) {
  const scope = determineScope(name);
  const total = scope.units + scope.integration * 2 + scope.e2e * 3;
  return Math.ceil(total * 0.5);
}

function findTestDependencies(featureName) {
  const deps = ["測試環境就緒", "測試資料準備"];

  if (featureName.toLowerCase().includes("api")) {
    deps.push("API 文件準備");
  }

  if (featureName.toLowerCase().includes("登入")) {
    deps.push("測試帳號準備");
  }

  return deps;
}
