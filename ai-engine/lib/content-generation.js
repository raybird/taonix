const responseTemplates = {
  github_trending: (data) => {
    if (!data || data.length === 0) {
      return "我找不到今天的趨勢專案，可能是 API 有限制。";
    }

    const top = data.slice(0, 5);
    let report = "📊 今日 GitHub Trending 熱門：\n\n";

    top.forEach((repo, i) => {
      report += `${i + 1}. **${repo.name}**\n`;
      report += `   ⭐ ${repo.stars} | ${repo.language || "N/A"}\n`;
      if (repo.description) {
        report += `   ${repo.description}\n`;
      }
      report += "\n";
    });

    return report;
  },

  web_search: (data) => {
    if (!data || data.length === 0) {
      return "搜尋結果為空。";
    }

    let report = "🔍 搜尋結果：\n\n";
    data.forEach((item, i) => {
      report += `${i + 1}. ${item.title}\n`;
      report += `   ${item.url}\n`;
      if (item.snippet) {
        report += `   ${item.snippet.slice(0, 100)}...\n`;
      }
      report += "\n";
    });

    return report;
  },

  code_review: (data) => {
    if (!data) {
      return "無法進行代碼審查。";
    }

    let report = "🔍 代碼審查報告\n\n";
    report += `檔案: ${data.filepath}\n`;
    report += `總行數: ${data.totalLines}\n`;

    if (data.issues && data.issues.length > 0) {
      report += "\n發現問題：\n";
      data.issues.forEach((issue) => {
        report += `- L${issue.line}: ${issue.message}\n`;
      });
    } else {
      report += "\n✅ 沒有發現問題！\n";
    }

    return report;
  },

  default: (data) => {
    return JSON.stringify(data, null, 2);
  },
};

export async function generateContent(intent, agentResult) {
  const { intent: intentType, raw: userInput } = intent;

  const template = responseTemplates[intentType] || responseTemplates.default;

  return {
    intent: intentType,
    userInput,
    agent: agentResult.primary,
    content: "等待 Agent 執行結果...",
    template: intentType,
  };
}

export function formatResponse(intentType, data) {
  const template = responseTemplates[intentType] || responseTemplates.default;
  return template(data);
}
