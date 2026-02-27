import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "../.data");

class TaskHistory {
  constructor() {
    this.tasks = [];
    this.maxHistory = 100;
    this.ensureDataDir();
    this.load();
  }

  ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  load() {
    const historyFile = path.join(DATA_DIR, "task-history.json");
    if (fs.existsSync(historyFile)) {
      const data = JSON.parse(fs.readFileSync(historyFile, "utf-8"));
      this.tasks = data.tasks || [];
    }
  }

  save() {
    const historyFile = path.join(DATA_DIR, "task-history.json");
    fs.writeFileSync(
      historyFile,
      JSON.stringify({ tasks: this.tasks }, null, 2),
    );
  }

  addTask(task) {
    const taskRecord = {
      id: `task_${Date.now()}`,
      timestamp: new Date().toISOString(),
      input: task.input?.substring(0, 500) || "",
      skill: task.skill || null,
      agents: task.agents || [],
      status: task.status || "completed",
      duration: task.duration || 0,
      result: task.result?.substring(0, 200) || "",
    };

    this.tasks.unshift(taskRecord);

    if (this.tasks.length > this.maxHistory) {
      this.tasks = this.tasks.slice(0, this.maxHistory);
    }

    this.save();
    return taskRecord.id;
  }

  getHistory(limit = 10) {
    return this.tasks.slice(0, limit);
  }

  getHistoryBySkill(skill) {
    return this.tasks.filter((t) => t.skill === skill);
  }

  getStats() {
    const total = this.tasks.length;
    const bySkill = {};
    const byAgent = {};
    const byStatus = {};

    for (const task of this.tasks) {
      if (task.skill) {
        bySkill[task.skill] = (bySkill[task.skill] || 0) + 1;
      }
      for (const agent of task.agents) {
        byAgent[agent] = (byAgent[agent] || 0) + 1;
      }
      byStatus[task.status] = (byStatus[task.status] || 0) + 1;
    }

    return { total, bySkill, byAgent, byStatus };
  }

  clear() {
    this.tasks = [];
    this.save();
  }
}

export const taskHistory = new TaskHistory();
export default taskHistory;
