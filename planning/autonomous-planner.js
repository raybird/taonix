import { GoalTracker } from "../planning/goal-tracker.js";
import { PlanningEngine } from "../planning/planning-engine.js";
import { ProactiveSuggestionEngine } from "../planning/proactive-engine.js";
import { LearningModule } from "../memory/learning.js";

export class AutonomousPlanner {
  constructor() {
    this.goalTracker = new GoalTracker();
    this.planningEngine = new PlanningEngine();
    this.suggestionEngine = new ProactiveSuggestionEngine();
    this.learning = new LearningModule();
    this.longTermGoals = [];
    this.sessionId = `session_${Date.now()}`;
  }

  async analyzeAndPlan(userInput) {
    const analysis = this.analyzeInput(userInput);

    if (analysis.type === "goal") {
      return await this.handleGoalCreation(analysis);
    } else if (analysis.type === "task") {
      return await this.handleTaskExecution(analysis);
    } else if (analysis.type === "question") {
      return this.handleQuestion(analysis);
    }

    return { type: "unknown", message: "無法理解輸入" };
  }

  analyzeInput(input) {
    const lowerInput = input.toLowerCase();

    if (
      lowerInput.includes("目標") ||
      lowerInput.includes("goal") ||
      lowerInput.includes("規劃") ||
      lowerInput.includes("计划") ||
      lowerInput.includes("進化") ||
      lowerInput.includes("演進") ||
      lowerInput.includes("開發") ||
      lowerInput.includes("能力")
    ) {
      return { type: "goal", original: input };
    }

    if (
      lowerInput.includes("做") ||
      lowerInput.includes("執行") ||
      lowerInput.includes("完成") ||
      lowerInput.includes("请") ||
      lowerInput.includes("幫")
    ) {
      return { type: "task", original: input };
    }

    if (
      lowerInput.includes("什麼") ||
      lowerInput.includes("怎麼") ||
      lowerInput.includes("如何") ||
      lowerInput.includes("？") ||
      lowerInput.includes("?")
    ) {
      return { type: "question", original: input };
    }

    return { type: "general", original: input };
  }

  async handleGoalCreation(analysis) {
    const goalId = `goal_${Date.now()}`;
    const goal = this.goalTracker.createGoal(
      goalId,
      analysis.original,
      "由 AutonomousPlanner 自動建立",
      this.calculateDeadline(analysis.original),
    );

    const tasks = this.decomposeGoal(analysis.original);
    tasks.forEach((task, index) => {
      this.goalTracker.addSubGoal(
        goalId,
        `sub_${goalId}_${index}`,
        task.title,
        task.description,
      );
    });

    this.longTermGoals.push(goal);

    return {
      type: "goal_created",
      goal: {
        id: goal.id,
        title: goal.title,
        deadline: goal.deadline,
        tasks: tasks.map((t) => t.title),
      },
      message: `已建立目標「${goal.title}」，共分解為 ${tasks.length} 個任務`,
    };
  }

  calculateDeadline(input) {
    const now = new Date();
    const lowerInput = input.toLowerCase();

    if (lowerInput.includes("今天") || lowerInput.includes("today")) {
      return now.toISOString();
    }
    if (lowerInput.includes("明天") || lowerInput.includes("tomorrow")) {
      now.setDate(now.getDate() + 1);
      return now.toISOString();
    }
    if (
      lowerInput.includes("一週") ||
      lowerInput.includes("一周") ||
      lowerInput.includes("week")
    ) {
      now.setDate(now.getDate() + 7);
      return now.toISOString();
    }
    if (lowerInput.includes("一個月") || lowerInput.includes("month")) {
      now.setMonth(now.getMonth() + 1);
      return now.toISOString();
    }

    now.setDate(now.getDate() + 3);
    return now.toISOString();
  }

  decomposeGoal(goalTitle) {
    const tasks = [];
    const lowerTitle = goalTitle.toLowerCase();

    if (
      lowerTitle.includes("開發") ||
      lowerTitle.includes("开发") ||
      lowerTitle.includes("implement") ||
      lowerTitle.includes("build")
    ) {
      tasks.push(
        { title: "需求分析", description: "分析並定義需求" },
        { title: "架構設計", description: "設計系統架構" },
        { title: "實作核心功能", description: "實現主要功能" },
        { title: "測試驗證", description: "撰寫測試並驗證" },
        { title: "優化與部署", description: "效能優化並部署" },
      );
    } else if (
      lowerTitle.includes("學習") ||
      lowerTitle.includes("学习") ||
      lowerTitle.includes("learn") ||
      lowerTitle.includes("研究")
    ) {
      tasks.push(
        { title: "收集資料", description: "搜尋相關資源" },
        { title: "理解概念", description: "深入理解核心概念" },
        { title: "實作練習", description: "動手實踐" },
        { title: "總結分享", description: "整理並分享所學" },
      );
    } else if (
      lowerTitle.includes("網站") ||
      lowerTitle.includes("web") ||
      lowerTitle.includes("app") ||
      lowerTitle.includes("應用")
    ) {
      tasks.push(
        { title: "需求收集", description: "了解用戶需求" },
        { title: "UI/UX 設計", description: "設計介面與體驗" },
        { title: "前端開發", description: "開發前端" },
        { title: "後端開發", description: "開發後端" },
        { title: "測試與上線", description: "測試並部署" },
      );
    } else {
      tasks.push(
        { title: "第一步", description: "開始行動" },
        { title: "第二步", description: "持續推進" },
        { title: "第三步", description: "完成目標" },
      );
    }

    return tasks;
  }

  async handleTaskExecution(analysis) {
    const suggestion = {
      text: analysis.original,
      context: "task_execution",
      category: "action",
      priority: "high",
    };

    this.suggestionEngine.addSuggestion(suggestion);

    return {
      type: "task_queued",
      message: `任務「${analysis.original}」已加入待辦清單`,
      suggestionId: suggestion.id,
    };
  }

  handleQuestion(analysis) {
    const suggestions = this.suggestionEngine.getSuggestions(analysis.original);

    return {
      type: "question_answered",
      question: analysis.original,
      suggestions: suggestions.map((s) => s.text),
      message: "已檢索相關建議",
    };
  }

  getProgressReport() {
    const allGoals = Array.from(this.goalTracker.goals.values());
    const activeGoals = allGoals.filter((g) => g.status === "in_progress");
    const completedGoals = allGoals.filter((g) => g.status === "completed");

    const suggestions = this.suggestionEngine.getSuggestions();

    return {
      summary: {
        total: allGoals.length,
        active: activeGoals.length,
        completed: completedGoals.length,
        completionRate:
          allGoals.length > 0
            ? Math.round((completedGoals.length / allGoals.length) * 100)
            : 0,
      },
      activeGoals: activeGoals.map((g) => ({
        id: g.id,
        title: g.title,
        progress: g.progress,
        deadline: g.deadline,
      })),
      suggestions: suggestions.slice(0, 3),
      nextActions: this.generateNextActions(activeGoals),
    };
  }

  generateNextActions(activeGoals) {
    const actions = [];

    for (const goal of activeGoals) {
      if (goal.progress < 30) {
        actions.push({
          goalId: goal.id,
          title: `開始「${goal.title}」`,
          priority: "high",
        });
      } else if (goal.progress < 70) {
        actions.push({
          goalId: goal.id,
          title: `持續推進「${goal.title}」`,
          priority: "medium",
        });
      } else {
        actions.push({
          goalId: goal.id,
          title: `完成「${goal.title}」的最後衝刺`,
          priority: "high",
        });
      }
    }

    return actions;
  }

  updateGoalProgress(goalId, progress) {
    return this.goalTracker.updateProgress(goalId, progress);
  }

  getGoals() {
    return Array.from(this.goalTracker.goals.values());
  }

  async learnFromContext(context) {
    await this.learning.learn({
      ...context,
      sessionId: this.sessionId,
    });
  }
}

export const autonomousPlanner = new AutonomousPlanner();
