export class IntentAnalyzer {
  constructor() {
    this.intents = {
      schedule: {
        keywords: ["排程", "schedule", "定時", "每", "任務", "提醒"],
        actions: ["建立", "查看", "取消", "執行"],
      },
      memory: {
        keywords: ["記憶", "memory", "記得", "之前", "儲存", "搜尋"],
        actions: ["搜尋", "儲存", "清除", "忘記"],
      },
      analysis: {
        keywords: ["分析", "如何", "怎麼", "為什麼", "建議"],
        actions: ["分析", "評估", "檢視"],
      },
      communication: {
        keywords: ["告訴", "通知", "訊息", "發送", "telegram"],
        actions: ["發送", "通知", "告訴"],
      },
      execution: {
        keywords: ["執行", "run", "做", "完成", "開始"],
        actions: ["執行", "開始", "完成"],
      },
      retrieval: {
        keywords: ["找", "查", "看", "搜尋", "取得"],
        actions: ["搜尋", "查詢", "取得"],
      },
    };
  }

  analyze(input) {
    const normalizedInput = input.toLowerCase();
    let bestIntent = "general";
    let highestScore = 0;
    const detectedEntities = this.extractEntities(input);

    for (const [intent, config] of Object.entries(this.intents)) {
      const keywordScore = config.keywords.filter((k) =>
        normalizedInput.includes(k.toLowerCase()),
      ).length;
      const actionScore = config.actions.filter((a) =>
        normalizedInput.includes(a.toLowerCase()),
      ).length;
      const totalScore = keywordScore * 0.6 + actionScore * 0.4;

      if (totalScore > highestScore) {
        highestScore = totalScore;
        bestIntent = intent;
      }
    }

    const confidence = Math.min(highestScore / 2, 1);

    return {
      input,
      intent: bestIntent,
      entities: detectedEntities,
      confidence,
      suggestedActions: this.getSuggestions(bestIntent),
      requiresPlanning: bestIntent === "analysis" || bestIntent === "schedule",
    };
  }

  extractEntities(input) {
    const entities = [];
    const timePatterns =
      /\d{1,2}[時:]\d{2}|早上|下午|晚上|今天|明天|週[一二三四五六日]/g;
    const timeMatches = input.match(timePatterns);
    if (timeMatches) {
      entities.push({ type: "time", values: timeMatches });
    }
    return entities;
  }

  getSuggestions(intent) {
    const suggestions = {
      schedule: ["建立排程", "查看排程", "取消排程"],
      memory: ["搜尋記憶", "儲存資訊", "清除記憶"],
      analysis: ["深入分析", "生成報告", "提供建議"],
      communication: ["發送通知", "傳送訊息", "建立提醒"],
      execution: ["執行任務", "開始處理", "完成操作"],
      retrieval: ["搜尋資料", "查詢狀態", "取得資訊"],
      general: ["提供更多資訊", "等待指示"],
    };
    return suggestions[intent] || suggestions.general;
  }
}

export async function analyzeRequest(input) {
  const analyzer = new IntentAnalyzer();
  return analyzer.analyze(input);
}
