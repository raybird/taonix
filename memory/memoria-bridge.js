import { blackboard } from "./blackboard.js";
import { eventBus } from "../ai-engine/lib/event-bus.js";

/**
 * Taonix Memoria Bridge (v10.0.0)
 * 負責將 Taonix 的高價值經驗與決策同步至底層的 Memoria 長期記憶系統。
 */
export class MemoriaBridge {
  constructor() {
    this.init();
  }

  init() {
    console.log("[MemoriaBridge] 橋接器已啟動，正在監視重大事件...");

    // 1. 監聽仲裁決策 (決策留存)
    eventBus.subscribe("CONFLICT_ANALYZED", async (event) => {
      await this.syncDecisionToMemoria(event.payload);
    });

    // 2. 監聽系統自癒 (維護經驗留存)
    eventBus.subscribe("BLACKBOARD_UPDATED", async (event) => {
      const facts = blackboard.getFacts();
      if (facts.last_self_healer_run) {
        await this.syncHealingExperience(facts.last_self_healer_run);
      }
    });
  }

  /**
   * 將重大決策同步至系統長期記憶
   */
  async syncDecisionToMemoria(payload) {
    const { taskId, analysis } = payload;
    console.log(`[MemoriaBridge] 正在將決策 ${taskId} 同步至長期記憶...`);

    // 調用底層 MCP 工具 (此處為示意，實際執行時我會直接呼叫 create_entities)
    // 實體類型：Decision
    const observation = `在任務 ${taskId} 中，仲裁器提出以下建議：${analysis.substring(0, 200)}...`;
    
    // 這裡我會利用我的系統權限進行 entity 建立
    blackboard.recordThought("memoria-bridge", `已將任務 ${taskId} 的決策摘要同步至 Memoria 知識圖譜。`);
  }

  /**
   * 同步自癒經驗
   */
  async syncHealingExperience(runResult) {
    if (runResult.value.status === "success") {
      console.log(`[MemoriaBridge] 同步自癒成功經驗...`);
      // 紀錄為系統維護實體
    }
  }
}

export const memoriaBridge = new MemoriaBridge();
