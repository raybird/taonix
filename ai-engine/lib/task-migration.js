import { blackboard } from "../../memory/blackboard.js";
import { eventBus } from "./event-bus.js";
import { consensusManager } from "./consensus-manager.js";

/**
 * Taonix Task Migration Engine (v23.0.0)
 * 負責任務執行權在分散式節點間的熱遷移。
 */
export class TaskMigration {
  constructor() {
    this.init();
  }

  init() {
    console.log("[Migration] 任務遷移引擎啟動，正在監視集群負載...");

    // 監聽遷移請求
    eventBus.subscribe("TASK_OFFER", (event) => {
      this.evaluateAcceptance(event.payload, event.metadata.source);
    });
  }

  /**
   * 發起任務遷移
   */
  async offerTask(taskId) {
    const taskState = blackboard.getFacts()[`task_${taskId}`];
    if (!taskState) return;

    console.log(`[Migration] 正向全球集群發起任務遷移請求: ${taskId}`);
    const syncPkg = consensusManager.getSyncPackage(`task_${taskId}`);
    
    eventBus.publish("TASK_OFFER", {
      taskId,
      context: syncPkg,
      priority: taskState.value.priority || "normal"
    }, "migration-engine", { broadcast: true });
  }

  /**
   * 評估是否接受遷移過來的任務
   */
  async evaluateAcceptance(payload, source) {
    // 簡單規則：如果當前沒有活動任務，則嘗試接手
    if (!blackboard.getActiveTask()) {
      console.log(`[Migration] 偵測到來自 ${source} 的任務請求 ${payload.taskId}，準備接手執行。`);
      // 實作層：將任務上下文寫入本地黑板並啟動 Dispatcher
      eventBus.publish("TASK_CLAIMED", { taskId: payload.taskId }, "migration-engine", { broadcast: true });
    }
  }
}

export const taskMigration = new TaskMigration();
