import { eventBus } from "../ai-engine/lib/event-bus.js";
import { experienceBase } from "./experience-base.js";
import { blackboard } from "./blackboard.js";

/**
 * Taonix Auto Scorer (v6.0.0)
 * 負責自動評估任務執行質量並更新經驗庫。
 */
export class AutoScorer {
  constructor() {
    this.init();
  }

  init() {
    console.log("[AutoScorer] 自動評分系統已啟動...");
    
    // 監聽任務完成
    eventBus.subscribe("TASK_COMPLETED", async (event) => {
      await this.scoreTask(event.payload, true);
    });

    // 監聽任務失敗
    eventBus.subscribe("TASK_ERROR", async (event) => {
      await this.scoreTask(event.payload, false);
    });
  }

  /**
   * 執行任務評分
   */
  async scoreTask(payload, isSuccess) {
    const { taskId, result, error, agent } = payload;
    
    // 1. 查找對應小隊資訊
    const facts = blackboard.getFacts();
    const squadKey = Object.keys(facts).find(k => k.includes(taskId) && k.startsWith("active_squad_"));
    const squad = squadKey ? facts[squadKey].value : null;
    
    if (!squad) return;

    // 2. 計算分數 (基礎邏輯)
    let score = isSuccess ? 4 : 1;
    
    // 成功獎勵：若無錯誤且執行順利則加分
    if (isSuccess && result && result.status === "success") score += 1;
    
    // 3. 紀錄到經驗庫
    experienceBase.recordSession(
      squad.squadId,
      taskId,
      squad.members,
      {
        success: isSuccess,
        score: score,
        feedback: isSuccess ? "Auto-graded: Task completed normally" : `Auto-graded: Failed with error ${error}`
      }
    );

    console.log(`[AutoScorer] 已完成任務 ${taskId} 的自動評分: ${score} 分`);
  }
}

export const autoScorer = new AutoScorer();
