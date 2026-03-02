import { blackboard } from "../../memory/blackboard.js";
import { eventBus } from "./event-bus.js";

/**
 * Taonix Context Recovery Engine (v19.0.0)
 * 負責在任務異常中斷後，利用黑板足跡自動恢復執行上下文。
 */
export class ContextRecovery {
  constructor() {
    this.init();
  }

  init() {
    console.log("[Recovery] 上下文恢復引擎啟動，正在監視執行足跡...");

    // 1. 監聽任務崩潰 (透過 Dispatcher 報錯)
    eventBus.subscribe("TASK_FAILED", (event) => {
      this.saveCrashSnapshot(event.payload);
    });

    // 2. 啟動時掃描是否有未完成的長程任務
    this.scanPendingTasks();
  }

  saveCrashSnapshot(payload) {
    const snapshot = {
      taskId: payload.taskId,
      lastAgent: payload.agent,
      error: payload.error,
      factsAtCrash: blackboard.getFacts(),
      timestamp: Date.now()
    };
    blackboard.updateFact(`crash_snapshot_${payload.taskId}`, snapshot, "recovery-engine");
    console.log(`[Recovery] 已儲存任務 ${payload.taskId} 的崩潰快照。`);
  }

  async scanPendingTasks() {
    const facts = blackboard.getFacts();
    const snapshots = Object.entries(facts).filter(([k]) => k.startsWith("crash_snapshot_"));

    for (const [key, fact] of snapshots) {
      const snap = fact.value;
      // 若崩潰在 1 小時內，嘗試建議恢復
      if (Date.now() - snap.timestamp < 3600000) {
        console.warn(`[Recovery] 偵測到可恢復任務: ${snap.taskId} (${snap.lastAgent})`);
        eventBus.publish("RECOVERY_SUGGESTED", { 
          taskId: snap.taskId, 
          suggestion: `任務在執行 ${snap.lastAgent} 時中斷。具備 ${Object.keys(snap.factsAtCrash).length} 筆上下文事實可供恢復。`
        }, "recovery-engine");
      }
    }
  }
}

export const contextRecovery = new ContextRecovery();
