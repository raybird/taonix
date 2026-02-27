const intentPatterns = {
  github_trending: [
    "趋势",
    "热门",
    "trending",
    "流行",
    "最热",
    "hot",
    "有什么好玩的",
    "有什么好玩",
    "热门项目",
    "流行项目",
  ],
  web_search: ["搜索", "搜尋", "search", "找", "查", "新闻", "资讯", "信息"],
  code_review: ["代码审查", "code review", "檢查代碼", "審查", "review"],
  analyze_structure: ["结构", "結構", "架構", "architecture", "分析结构"],
  analyze_deps: ["依赖", "依賴", "dependencies", "套件", "分析依赖"],
  check_quality: ["品質", "质量", "quality", "代码质量", "品質檢查"],
  check_format: ["格式", "format", "格式检查"],
  read_file: ["读取檔案", "讀取檔案", "read file", "看檔案", "查看檔案"],
  write_file: ["写入", "寫入", "write", "新建檔案"],
  run_command: ["执行", "執行", "run", "跑", "运行", "運作"],
};

const agentMapping = {
  github_trending: "explorer",
  web_search: "explorer",
  code_review: "coder",
  analyze_structure: "oracle",
  analyze_deps: "oracle",
  check_quality: "reviewer",
  check_format: "reviewer",
  read_file: "coder",
  write_file: "coder",
  run_command: "coder",
};

const paramPatterns = {
  language: [
    "python",
    "javascript",
    "java",
    "go",
    "rust",
    "typescript",
    "js",
    "ts",
  ],
  tool: ["github", "web"],
  time: ["今天", "今日", "昨天", "最近", "week", "日", "週"],
};

export async function analyzeIntent(input) {
  const lowerInput = input.toLowerCase();

  let matchedIntent = "unknown";
  let confidence = 0;

  for (const [intent, keywords] of Object.entries(intentPatterns)) {
    for (const keyword of keywords) {
      if (lowerInput.includes(keyword.toLowerCase())) {
        matchedIntent = intent;
        confidence = Math.min(confidence + 0.3, 1);
      }
    }
  }

  const params = extractParams(input);
  const agent = agentMapping[matchedIntent] || "unknown";

  return {
    input,
    intent: matchedIntent,
    confidence,
    agent,
    params,
    raw: input,
  };
}

function extractParams(input) {
  const params = {};
  const lowerInput = input.toLowerCase();

  for (const [paramName, values] of Object.entries(paramPatterns)) {
    for (const value of values) {
      if (lowerInput.includes(value)) {
        params[paramName] = value;
      }
    }
  }

  return params;
}

export function getIntentExamples() {
  return {
    "帮我看看最近 python 有什么好玩的": {
      intent: "github_trending",
      agent: "explorer",
      params: { language: "python" },
    },
    "帮我搜索一下 AI 的最新新闻": {
      intent: "web_search",
      agent: "explorer",
      params: { query: "AI 最新新闻" },
    },
    检查这个项目的代码质量: {
      intent: "check_quality",
      agent: "reviewer",
      params: {},
    },
  };
}
