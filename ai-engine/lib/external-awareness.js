import { apiConnector } from "./api-connector.js";
import { blackboard } from "../../memory/blackboard.js";
import { eventBus } from "./event-bus.js";

/**
 * Taonix External Awareness (v7.0.0)
 * 負責主動監測外部環境狀態並同步至黑板。
 */
export class ExternalAwareness {
  constructor() {
    this.monitors = new Map();
  }

  /**
   * 添加監控任務
   */
  addMonitor(name, endpoint, interval = 60000) {
    console.log(`[Awareness] 啟動外部監控: ${name} (${interval}ms)`);
    const timer = setInterval(async () => {
      try {
        const result = await apiConnector.request(endpoint);
        
        // 更新黑板事實
        blackboard.updateFact(`external_status_${name}`, result.data, "awareness");
        
        // 紀錄推理
        blackboard.recordThought("awareness", `外部環境感知更新 [${name}]：偵測到最新狀態。數據已同步至事實牆。`);
        
        eventBus.publish("EXTERNAL_STATE_CHANGED", { name, state: result.data }, "awareness");
      } catch (e) {
        console.warn(`[Awareness] 監控 ${name} 失敗:`, e.message);
      }
    }, interval);

    this.monitors.set(name, timer);
  }

  stopAll() {
    this.monitors.forEach(timer => clearInterval(timer));
  }
}

export const externalAwareness = new ExternalAwareness();
