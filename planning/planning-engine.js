class PlanningEngine {
  constructor() {
    this.goals = new Map();
    this.subGoals = new Map();
    this.tracking = new Map();
  }

  createGoal(title, description, deadline, priority = "P1") {
    const goal = {
      id: `goal_${Date.now()}`,
      title,
      description,
      deadline,
      priority,
      status: "active",
      created: new Date().toISOString(),
      subGoals: [],
      progress: 0,
    };
    this.goals.set(goal.id, goal);
    return goal;
  }

  addSubGoal(goalId, title, tasks = []) {
    const goal = this.goals.get(goalId);
    if (!goal) return null;

    const subGoal = {
      id: `sub_${Date.now()}`,
      title,
      tasks,
      status: "pending",
      progress: 0,
    };
    goal.subGoals.push(subGoal);
    this.subGoals.set(subGoal.id, subGoal);
    return subGoal;
  }

  updateProgress(goalId, progress) {
    const goal = this.goals.get(goalId);
    if (goal) {
      goal.progress = Math.min(100, Math.max(0, progress));
      if (goal.progress === 100) {
        goal.status = "completed";
      }
    }
    return goal;
  }

  trackMilestone(goalId, milestone) {
    const goal = this.goals.get(goalId);
    if (!goal) return null;

    const tracking = {
      id: `track_${Date.now()}`,
      milestone,
      timestamp: new Date().toISOString(),
      status: "completed",
    };
    this.tracking.set(tracking.id, tracking);
    return tracking;
  }

  getGoals() {
    return Array.from(this.goals.values());
  }

  getGoal(goalId) {
    return this.goals.get(goalId);
  }

  getActiveGoals() {
    return this.getGoals().filter((g) => g.status === "active");
  }

  getOverdueGoals() {
    const now = new Date();
    return this.getGoals().filter((g) => {
      return g.status === "active" && new Date(g.deadline) < now;
    });
  }

  generateReport() {
    const goals = this.getGoals();
    const active = this.getActiveGoals();
    const completed = goals.filter((g) => g.status === "completed");
    const overdue = this.getOverdueGoals();

    return {
      total: goals.length,
      active: active.length,
      completed: completed.length,
      overdue: overdue.length,
      goals: goals.map((g) => ({
        id: g.id,
        title: g.title,
        progress: g.progress,
        status: g.status,
        deadline: g.deadline,
      })),
    };
  }
}

export const planningEngine = new PlanningEngine();
export default planningEngine;
