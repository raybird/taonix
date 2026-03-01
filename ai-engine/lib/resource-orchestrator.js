import { eventBus } from "./event-bus.js";
import { blackboard } from "../../memory/blackboard.js";
import { priorityManager } from "./priority-manager.js";

/**
 * Taonix Resource Orchestrator (v16.0.0)
 * 負責全系統 Agent 任務的動態調度與優先級管理。
 */
export class ResourceOrchestrator {
  constructor() {
    this.suspendedTasks = new Map(); // taskId -> taskInfo
    this.init();
  }

  init() {
    console.log("[Orchestrator] 資源調度器已啟動，正在監視系統負載...");

    // 1. 監聽效能警報，決定是否掛起任務 (v16.0.0 優先級對齊)
    eventBus.subscribe("PERFORMANCE_ALERT", (event) => {
      this.handleHighLoad(event.payload);
    });

    // 2. 監聽資源釋放事实 (Fact)，決定是否恢復任務
    eventBus.subscribe("BLACKBOARD_UPDATED", () => {
      this.checkSystemRelief();
    });
  }

  handleHighLoad(alert) {
    if (alert.level === "warning" || alert.level === "critical") {
      console.log(`[Orchestrator] 偵測到效能風險，評估可掛起任務...`);
      
      // 獲取當前執行中的任務 (假設從黑板或 dispatcher 取得)
      const facts = blackboard.getFacts();
      // 簡單模擬：如果正在執行 explorer，且它在模型中是可掛起的
      if (alert.agent === "explorer" && priorityManager.isSuspendable("explorer")) {
        console.log(`[Orchestrator] 指令掛起低優先級 Agent: ${alert.agent}`);
        eventBus.publish("TASK_SUSPEND", { taskId: alert.taskId || "current", reason: "load_shedding" }, "orchestrator");
      }
    }
  }

  checkSystemRelief() {
    // 恢復邏輯實作預留
  }
}

export const resourceOrchestrator = new ResourceOrchestrator();
