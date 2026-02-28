import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.resolve(__dirname, "..", ".data", "goals.json");

export class GoalTracker {
  constructor() {
    this.goals = new Map();
    this.subGoals = new Map();
    this.load();
  }

  load() {
    try {
      if (fs.existsSync(DATA_PATH)) {
        const data = JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
        Object.entries(data.goals || {}).forEach(([id, goal]) =>
          this.goals.set(id, goal),
        );
        Object.entries(data.subGoals || {}).forEach(([id, subGoal]) =>
          this.subGoals.set(id, subGoal),
        );
      }
    } catch (e) {
      console.warn("[GoalTracker] 無法載入數據:", e.message);
    }
  }

  save() {
    try {
      const dir = path.dirname(DATA_PATH);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      const data = {
        goals: Object.fromEntries(this.goals),
        subGoals: Object.fromEntries(this.subGoals),
      };
      fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
    } catch (e) {
      console.warn("[GoalTracker] 無法儲存數據:", e.message);
    }
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
    this.save();
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
    this.save();

    return subGoal;
  }

  updateProgress(id, progress) {
    let result = null;
    if (this.goals.has(id)) {
      const goal = this.goals.get(id);
      goal.progress = Math.min(100, Math.max(0, progress));
      goal.status = progress >= 100 ? "completed" : "in_progress";
      result = goal;
    } else if (this.subGoals.has(id)) {
      const subGoal = this.subGoals.get(id);
      subGoal.progress = Math.min(100, Math.max(0, progress));
      subGoal.status = progress >= 100 ? "completed" : "in_progress";
      result = subGoal;
    }
    if (result) this.save();
    return result;
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
