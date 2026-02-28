#!/usr/bin/env node

import { scheduleTask } from "./lib/scheduler-helper.js";
import { searchMemory } from "./lib/memory-helper.js";
import { analyzeRequest } from "./lib/analyzer.js";
import { evolutionEngine } from "../../memory/evolution-engine.js";
import { conversationSummarizer } from "../../memory/conversation-summarizer.js";

const args = process.argv.slice(2);

if (args.length === 0) {
  console.log(`
Taonix Assistant Agent
======================
用法:
  assistant schedule <task> <cron>   - 建立排程任務
  assistant memory <query>             - 搜尋記憶
  assistant analyze <input>            - 分析請求
  assistant feedback <rating> <agent> - 記錄反饋 (1-5)
  assistant evolution                  - 查看進化狀態
  assistant summarize                  - 對話摘要統計
  `);
  process.exit(0);
}

const command = args[0];

switch (command) {
  case "schedule":
    if (args.length < 3) {
      console.error("用法: assistant schedule <task> <cron>");
      process.exit(1);
    }
    await scheduleTask(args[1], args[2]);
    break;

  case "memory":
    if (args.length < 2) {
      console.error("用法: assistant memory <query>");
      process.exit(1);
    }
    await searchMemory(args.slice(1).join(" "));
    break;

  case "analyze":
    if (args.length < 2) {
      console.error("用法: assistant analyze <input>");
      process.exit(1);
    }
    await analyzeRequest(args.slice(1).join(" "));
    break;

  case "feedback":
    const rating = parseInt(args[1]);
    const agent = args[2] || "general";
    if (isNaN(rating) || rating < 1 || rating > 5) {
      console.error("用法: assistant feedback <rating(1-5)> [agent]");
      process.exit(1);
    }
    evolutionEngine.recordFeedback({ type: "manual", rating, agent });
    console.log(`✅ 已記錄反饋：${agent} - ${rating} 星`);
    break;

  case "evolution":
    const perf = evolutionEngine.analyzePerformance();
    const suggestions = evolutionEngine.getAdaptiveSuggestions();
    console.log("\n📈 Taonix 進化狀態\n");
    console.log(
      `反饋總數: ${perf.totalFeedback} | 正面: ${perf.positiveFeedback} | 負面: ${perf.negativeFeedback}`,
    );
    console.log(`成功率: ${perf.successRate}% | 健康狀態: ${perf.health}`);
    console.log(
      `適應次數: ${perf.adaptations} | 改進次數: ${perf.improvements}\n`,
    );
    if (suggestions.length > 0) {
      console.log("💡 建議:");
      suggestions.slice(0, 3).forEach((s) => {
        console.log(`  [${s.priority}] ${s.type}: ${s.agent || s.issue || ""}`);
      });
    }
    break;

  case "summarize":
    const stats = conversationSummarizer.getStats();
    const topics = conversationSummarizer.getTopics();
    const actions = conversationSummarizer.getActionItems();
    console.log("\n📊 對話摘要統計\n");
    console.log(
      `摘要數: ${stats.summaryCount} | 行動項目: ${stats.actionItemCount} | 主題數: ${stats.topicCount}\n`,
    );
    console.log("📌 討論主題:", topics.join(", ") || "無");
    console.log("\n🎯 待辦行動:");
    actions.slice(-5).forEach((a) => {
      console.log(`  - ${a.content.substring(0, 60)}`);
    });
    break;

  default:
    console.error(`未知指令: ${command}`);
    process.exit(1);
}
