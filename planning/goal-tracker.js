class GoalTracker {
  constructor() {
    this.goals = new Map();
    this.subGoals = new Map();
  }

  createGoal(goalId, title, description, deadline = null) {
    const goal = {
      id: goalId,
      title,
      description,
      status: "pending",
      progress: 0,
      created: new Date().toISOString(),
      deadline,
      subGoals: [],
    };
    this.goals.set(goalId, goal);
    return goal;
  }

  addSubGoal(goalId, subGoalId, title, description) {
    const goal = this.goals.get(goalId);
    if (!goal) return null;

    const subGoal = {
      id: subGoalId,
      title,
      description,
      status: "pending",
      progress: 0,
      created: new Date().toISOString(),
    };

    goal.subGoals.push(subGoalId);
    this.subGoals.set(subGoalId, subGoal);

    return subGoal;
  }

  updateProgress(id, progress) {
    if (this.goals.has(id)) {
      const goal = this.goals.get(id);
      goal.progress = Math.min(100, Math.max(0, progress));
      goal.status = progress >= 100 ? "completed" : "in_progress";
      return goal;
    }
    if (this.subGoals.has(id)) {
      const subGoal = this.subGoals.get(id);
      subGoal.progress = Math.min(100, Math.max(0, progress));
      subGoal.status = progress >= 100 ? "completed" : "in_progress";
      return subGoal;
    }
    return null;
  }

  getGoal(goalId) {
    return this.goals.get(goalId) || null;
  }

  getAllGoals() {
    return Array.from(this.goals.values());
  }

  getSubGoals(goalId) {
    const goal = this.goals.get(goalId);
    if (!goal) return [];
    return goal.subGoals.map((id) => this.subGoals.get(id)).filter(Boolean);
  }

  completeGoal(goalId) {
    const goal = this.goals.get(goalId);
    if (!goal) return null;
    goal.progress = 100;
    goal.status = "completed";
    goal.completed = new Date().toISOString();
    return goal;
  }

  getStatus() {
    const goals = this.getAllGoals();
    return {
      total: goals.length,
      completed: goals.filter((g) => g.status === "completed").length,
      inProgress: goals.filter((g) => g.status === "in_progress").length,
      pending: goals.filter((g) => g.status === "pending").length,
      goals,
    };
  }
}

export const goalTracker = new GoalTracker();
export default goalTracker;
