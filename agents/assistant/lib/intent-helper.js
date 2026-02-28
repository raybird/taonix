export class IntentRecognizer {
  constructor() {
    this.intents = {
      help: { keywords: ["幫助", "help", "?", "怎麼", "如何"], priority: 1 },
      search: { keywords: ["搜尋", "search", "找", "查"], priority: 2 },
      code: { keywords: ["程式", "code", "開發", "寫", "改"], priority: 2 },
      analyze: { keywords: ["分析", "analyze", "架構", "結構"], priority: 2 },
      review: { keywords: ["審查", "review", "檢查", "把關"], priority: 2 },
      design: { keywords: ["設計", "design", "ui", "ux", "介面"], priority: 2 },
      product: {
        keywords: ["產品", "product", "規劃", "需求", "prd"],
        priority: 2,
      },
      test: { keywords: ["測試", "test", "驗證"], priority: 2 },
      execute: { keywords: ["執行", "run", "做", "開始"], priority: 3 },
      schedule: { keywords: ["排程", "schedule", "定时", "cron"], priority: 2 },
      report: { keywords: ["報告", "report", "摘要", "總結"], priority: 2 },
      translate: { keywords: ["翻譯", "translate", "翻"], priority: 2 },
      notify: { keywords: ["通知", "notify", "提醒", "alert"], priority: 2 },
      analyze_data: { keywords: ["數據", "data", "分析", "統計"], priority: 2 },
    };
  }

  recognize(text) {
    const scores = {};
    const textLower = text.toLowerCase();

    for (const [intent, config] of Object.entries(this.intents)) {
      scores[intent] = 0;
      for (const keyword of config.keywords) {
        if (textLower.includes(keyword.toLowerCase())) {
          scores[intent] += config.priority;
        }
      }
    }

    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const top = sorted[0];

    if (top[1] === 0) {
      return { intent: "unknown", confidence: 0, suggestions: [] };
    }

    return {
      intent: top[0],
      confidence: Math.min(top[1] / 5, 1),
      suggestions: this.getSuggestions(top[0]),
    };
  }

  getSuggestions(intent) {
    const suggestions = {
      help: ["search", "code", "analyze", "design"],
      search: ["explorer", "web"],
      code: ["coder", "system"],
      analyze: ["oracle", "analyzer"],
      review: ["reviewer"],
      design: ["designer"],
      product: ["product"],
      test: ["tester"],
      execute: ["system", "workflow"],
      schedule: ["scheduler"],
      report: ["report", "analytics"],
      translate: ["translation"],
      notify: ["notification"],
      analyze_data: ["analytics"],
    };
    return suggestions[intent] || [];
  }
}

export function parseNaturalLanguage(text) {
  const recognizer = new IntentRecognizer();
  return recognizer.recognize(text);
}
