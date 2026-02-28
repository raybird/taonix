#!/usr/bin/env node

import { goalTracker } from "./goal-tracker.js";
import { autonomousPlanner } from "./autonomous-planner.js";
import { progressAnalyzer } from "./progress-analyzer.js";

const args = process.argv.slice(2);
const command = args[0];

async function main() {
  switch (command) {
    case "create":
      const createTitle = args[1];
      const description = args[2] || "";
      const deadline = args[3] || null;
      if (!createTitle) {
        console.log("用法: taonix-planning create <標題> [描述] [截止日期]");
        process.exit(1);
      }
      const newGoalId = `goal_${Date.now()}`;
      console.log(
        goalTracker.createGoal(newGoalId, createTitle, description, deadline),
      );
      break;

    case "list":
      const status = goalTracker.getStatus();
      console.log("📋 目標列表\n");
      console.log(
        `總數: ${status.total} | 完成: ${status.completed} | 進行中: ${status.inProgress} | 待處理: ${status.pending}\n`,
      );
      status.goals.forEach((g) => {
        const progressBar =
          "█".repeat(Math.floor(g.progress / 10)) +
          "░".repeat(10 - Math.floor(g.progress / 10));
        const icon =
          g.status === "completed"
            ? "✅"
            : g.status === "in_progress"
              ? "🔄"
              : "⏳";
        console.log(`${icon} [${progressBar}] ${g.progress}% - ${g.title}`);
        if (g.description) console.log(`   ${g.description}`);
      });
      break;

    case "progress":
      const progressGoalId = args[1];
      const progress = parseInt(args[2]);
      if (!progressGoalId || isNaN(progress)) {
        console.log("用法: taonix-planning progress <目標ID> <進度百分比>");
        process.exit(1);
      }
      console.log(goalTracker.updateProgress(progressGoalId, progress));
      break;

    case "status":
      console.log(goalTracker.getStatus());
      break;

    case "plan":
      const planInput = args.slice(1).join(" ");
      if (!planInput) {
        console.log("用法: taonix-planning plan <目標或任務描述>");
        process.exit(1);
      }
      const planResult = await autonomousPlanner.analyzeAndPlan(planInput);
      console.log(JSON.stringify(planResult, null, 2));
      break;

    case "analyze":
      const analysis = await progressAnalyzer.analyze();
      console.log("\n📊 進度分析報告\n");
      console.log(`達成率: ${analysis.summary.completionRate}%`);
      console.log(
        `進行中: ${analysis.summary.active} | 已完成: ${analysis.summary.completed}\n`,
      );

      if (analysis.insights.length > 0) {
        console.log("💡 洞察:");
        analysis.insights.forEach((i) => {
          const icon =
            i.type === "success"
              ? "✅"
              : i.type === "warning"
                ? "⚠️"
                : i.type === "danger"
                  ? "❌"
                  : "ℹ️";
          console.log(`  ${icon} ${i.message}`);
        });
        console.log("");
      }

      if (analysis.recommendations.length > 0) {
        console.log("🎯 建議行動:");
        analysis.recommendations.slice(0, 3).forEach((r) => {
          console.log(`  [${r.priority.toUpperCase()}] ${r.action}`);
        });
      }
      break;

    case "report":
      const report = autonomousPlanner.getProgressReport();
      console.log(JSON.stringify(report, null, 2));
      break;

    case "help":
    default:
      console.log(`
📋 Taonix 長期規劃 CLI

用法:
  taonix-planning create <標題> [描述] [截止日期]  建立目標
  taonix-planning list                              列出所有目標
  taonix-planning progress <ID> <百分比>            更新進度
  taonix-planning status                            查看狀態
  taonix-planning plan <描述>                        智能規劃（自動分解目標）
  taonix-planning analyze                            進度分析與建議
  taonix-planning report                             完整進度報告
  taonix-planning help                               顯示說明
`);
  }
}

main().catch(console.error);
