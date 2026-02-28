import fs from "fs";
import path from "path";
import { eventBus } from "./event-bus.js";
import { blackboard } from "../../memory/blackboard.js";

/**
 * Taonix Task State Machine (v9.0.0)
 * 負責管理複雜、長程任務的狀態流轉、斷點續傳與資源追蹤。
 */
export class TaskStateMachine {
  constructor() {
    this.storageFile = "/app/workspace/projects/taonix/.data/task_states.json";
    this.tasks = new Map();
    this.load();
  }

  load() {
    try {
      if (fs.existsSync(this.storageFile)) {
        const data = JSON.parse(fs.readFileSync(this.storageFile, "utf-8"));
        Object.entries(data).forEach(([id, state]) => this.tasks.set(id, state));
      }
    } catch (e) {
      console.warn("[TaskStateMachine] 無法載入任務狀態:", e.message);
    }
  }

  save() {
    try {
      const dir = path.dirname(this.storageFile);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      const data = Object.fromEntries(this.tasks);
      fs.writeFileSync(this.storageFile, JSON.stringify(data, null, 2));
    } catch (e) {
      console.warn("[TaskStateMachine] 無法儲存任務狀態:", e.message);
    }
  }

  /**
   * 初始化長程任務
   */
  createTask(taskId, workflow) {
    const state = {
      id: taskId,
      status: "pending",
      steps: workflow.map((step, index) => ({
        id: index,
        description: step.description,
        agent: step.agent,
        status: "pending",
        result: null
      })),
      currentStep: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.tasks.set(taskId, state);
    this.save();
    console.log(`[TaskStateMachine] 已建立長程任務: ${taskId}`);
    return state;
  }

  /**
   * 推進任務步進
   */
  advance(taskId, stepId, result) {
    const task = this.tasks.get(taskId);
    if (!task) return;

    const step = task.steps.find(s => s.id === stepId);
    if (step) {
      step.status = "completed";
      step.result = result;
      task.currentStep += 1;
      task.updatedAt = new Date().toISOString();
      
      if (task.currentStep >= task.steps.length) {
        task.status = "completed";
        eventBus.publish("LONG_TASK_FINISHED", { taskId }, "state-machine");
      }
      
      this.save();
      blackboard.updateFact(`task_progress_${taskId}`, { current: task.currentStep, total: task.steps.length }, "state-machine");
    }
  }

  getTaskState(taskId) {
    return this.tasks.get(taskId);
  }

  /**
   * 恢復中斷的任務
   */
  resumeTask(taskId) {
    const task = this.tasks.get(taskId);
    if (!task || task.status === "completed") return null;

    console.log(`[TaskStateMachine] 正在恢復任務: ${taskId}，目前進度: ${task.currentStep}/${task.steps.length}`);
    const nextStep = task.steps.find(s => s.status === "pending");
    
    if (nextStep) {
      eventBus.publish("TASK_RESUMED", { taskId, nextStep }, "state-machine");
      return nextStep;
    }
    return null;
  }

  /**
   * 清理過期或已完成的任務數據 (預設保留 7 天)
   */
  cleanup(days = 7) {
    const now = Date.now();
    const threshold = days * 24 * 60 * 60 * 1000;
    let count = 0;

    for (const [id, task] of this.tasks.entries()) {
      if (task.status === "completed" && (now - new Date(task.updatedAt).getTime() > threshold)) {
        this.tasks.delete(id);
        count++;
      }
    }

    if (count > 0) {
      this.save();
      console.log(`[TaskStateMachine] 已清理 ${count} 筆過期任務紀錄。`);
    }
  }
}

export const taskStateMachine = new TaskStateMachine();
