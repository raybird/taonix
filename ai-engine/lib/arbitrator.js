import { eventBus } from "./event-bus.js";
import { blackboard } from "../../memory/blackboard.js";
import { AICaller } from "./ai-caller.js";

/**
 * Taonix Arbitrator (v4.4.0)
 * 負責處理系統衝突、錯誤與需要人類介入的決策。
 */
export class Arbitrator {
  constructor() {
    this.aiCaller = new AICaller();
    this.init();
  }

  init() {
    console.log("[Arbitrator] 仲裁器已啟動，開始監控異常事件...");
    
    // 監聽任務錯誤
    eventBus.subscribe("TASK_ERROR", async (event) => {
      await this.handleTaskError(event);
    });
  }

  /**
   * 處理任務失敗
   */
  async handleTaskError(event) {
    const { taskId, error, agent } = event.payload;
    console.log(`[Arbitrator] 偵測到任務失敗: ${taskId} (Agent: ${agent})`);

    // 1. 記錄到黑板
    blackboard.recordThought("arbitrator", `偵測到 ${agent} 在執行任務 ${taskId} 時失敗。錯誤原因: ${error}。啟動根因分析...`);

    // 2. 獲取黑板上下文進行 AI 分析
    const context = blackboard.getSummaryForContext();
    const prompt = `你是一個高級 AI 仲裁器。以下任務執行失敗，請根據上下文分析原因並提出 2-3 個解決方案或建議。
    
失敗任務 ID: ${taskId}
執行 Agent: ${agent}
錯誤訊息: ${error}

${context}`;

    const analysis = await this.aiCaller.call(prompt);

    if (!analysis.error) {
      // 3. 發布分析結果
      eventBus.publish("CONFLICT_ANALYZED", {
        taskId,
        originalError: error,
        analysis: analysis.content,
        resolutionType: "proposal"
      }, "arbitrator");

      blackboard.recordThought("arbitrator", `根因分析完成。建議方案：
${analysis.content}`);
      blackboard.updateFact("last_conflict_resolution", { taskId, status: "resolved_by_proposal" }, "arbitrator");
    }
  }

  /**
   * 請求人類介入 (模擬)
   */
  requestHumanIntervention(issue, options) {
    const eventId = eventBus.publish("HUMAN_INTERVENTION_REQUIRED", {
      issue,
      options,
      timestamp: new Date().toISOString()
    }, "arbitrator");
    
    blackboard.updateFact("pending_decision", { eventId, issue }, "arbitrator");
    console.log(`[Arbitrator] ⚠️ 已發起人類介入請求: ${issue}`);
    return eventId;
  }
}

export const arbitrator = new Arbitrator();
