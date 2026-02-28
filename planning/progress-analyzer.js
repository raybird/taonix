import { autonomousPlanner } from "./autonomous-planner.js";

export class ProgressAnalyzer {
  constructor() {
    this.history = [];
    this.analyzeInterval = 30 * 60 * 1000;
    this.lastAnalyzeTime = null;
  }

  async analyze() {
    const report = autonomousPlanner.getProgressReport();

    const analysis = {
      timestamp: new Date().toISOString(),
      ...report,
      insights: this.generateInsights(report),
      recommendations: this.generateRecommendations(report),
    };

    this.history.push(analysis);
    this.lastAnalyzeTime = Date.now();

    return analysis;
  }

  generateInsights(report) {
    const insights = [];
    const { summary, activeGoals } = report;

    if (summary.completionRate >= 80) {
      insights.push({
        type: "success",
        message: "目標達成率很高，表現優異！",
      });
    } else if (summary.completionRate < 30 && summary.total > 0) {
      insights.push({
        type: "warning",
        message: "達成率較低，建議檢視目標設定是否過於進取",
      });
    }

    const overdueGoals = activeGoals.filter((g) => {
      if (!g.deadline) return false;
      return new Date(g.deadline) < new Date();
    });

    if (overdueGoals.length > 0) {
      insights.push({
        type: "danger",
        message: `有 ${overdueGoals.length} 個目標已超過截止日期`,
      });
    }

    const stalledGoals = activeGoals.filter((g) => g.progress < 10);
    if (stalledGoals.length > 2) {
      insights.push({
        type: "info",
        message: `有 ${stalledGoals.length} 個目標尚未開始行動，建議立即啟動`,
      });
    }

    if (summary.active === 0 && summary.completed > 0) {
      insights.push({
        type: "success",
        message: "所有目標都已完成！可以設定新的目標繼續前進",
      });
    }

    return insights;
  }

  generateRecommendations(report) {
    const recommendations = [];
    const { summary, nextActions, suggestions } = report;

    if (nextActions.length > 0) {
      const topAction = nextActions[0];
      recommendations.push({
        priority: topAction.priority,
        action: topAction.title,
        reason: "這是下一個最優先的行動",
      });
    }

    if (suggestions.length > 0) {
      recommendations.push({
        priority: "medium",
        action: suggestions[0].text,
        reason: "根據歷史記錄，這可能是有效的行動",
      });
    }

    if (summary.active > 5) {
      recommendations.push({
        priority: "medium",
        action: "考慮暫停或簡化部分目標",
        reason: "同時追蹤過多目標可能會降低效率",
      });
    }

    if (summary.completed === 0 && summary.total > 0) {
      recommendations.push({
        priority: "high",
        action: "先完成一個小目標建立動能",
        reason: "儘速完成首個目標可建立信心與動能",
      });
    }

    return recommendations;
  }

  getTrend() {
    if (this.history.length < 2) return null;

    const recent = this.history.slice(-7);
    const completionRates = recent.map((r) => r.summary.completionRate);

    const avgRate =
      completionRates.reduce((a, b) => a + b, 0) / completionRates.length;
    const latestRate = completionRates[completionRates.length - 1];
    const firstRate = completionRates[0];

    const trend =
      latestRate > firstRate
        ? "improving"
        : latestRate < firstRate
          ? "declining"
          : "stable";

    return {
      trend,
      avgRate: Math.round(avgRate),
      change: Math.round(latestRate - firstRate),
      dataPoints: completionRates,
    };
  }

  getStatus() {
    return {
      lastAnalyzeTime: this.lastAnalyzeTime,
      historyLength: this.history.length,
      isHealthy: this.history.length > 0,
    };
  }

  async runScheduledAnalysis() {
    const status = this.getStatus();

    if (
      !status.lastAnalyzeTime ||
      Date.now() - status.lastAnalyzeTime > this.analyzeInterval
    ) {
      return await this.analyze();
    }

    return null;
  }
}

export const progressAnalyzer = new ProgressAnalyzer();
