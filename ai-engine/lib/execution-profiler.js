import { eventBus } from "./event-bus.js";
import { blackboard } from "../../memory/blackboard.js";

/**
 * Taonix Execution Profiler (v15.0.0)
 * 負責監控 Agent 執行的效率與資源佔用。
 */
export class ExecutionProfiler {
  constructor() {
    this.ongoingTasks = new Map();
    this.init();
  }

  init() {
    console.log("[Profiler] 效能分析器已啟動，正在監控 Agent 心跳...");

    // 1. 紀錄開始時間
    eventBus.subscribe("TASK_STARTED", (event) => {
      this.ongoingTasks.set(event.payload.taskId, {
        start: Date.now(),
        agent: event.payload.agent
      });
    });

    // 2. 計算耗時並紀錄至黑板
    eventBus.subscribe("TASK_FINISHED", (event) => {
      const task = this.ongoingTasks.get(event.payload.taskId);
      if (task) {
        const duration = Date.now() - task.start;
        console.log(`[Profiler] Agent ${task.agent} 完成任務，耗時 ${duration}ms`);
        
        blackboard.updateFact(`performance_${task.agent}`, {
          lastDuration: duration,
          taskId: event.payload.taskId,
          timestamp: Date.now()
        }, "profiler");

        this.ongoingTasks.delete(event.payload.taskId);
      }
    });
  }
}

export const executionProfiler = new ExecutionProfiler();
