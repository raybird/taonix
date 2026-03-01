import { blackboard } from "../../memory/blackboard.js";
import { eventBus } from "../../ai-engine/lib/event-bus.js";

/**
 * Taonix Base Agent (v14.1.0 - Hardened)
 * 解決「不扎實」問題：強制所有 Agent 具備黑板意識與事件閉環。
 */
export class BaseAgent {
  constructor(name) {
    this.name = name;
  }

  /**
   * 執行包裝器
   * @param {string} task 任務描述
   * @param {Function} executor 實際執行邏輯
   */
  async runTask(task, executor) {
    const taskId = `task_${Date.now()}`;
    console.log(`[${this.name}] 正在執行任務: ${task}`);

    // 1. 執行前：從黑板拉取相關背景 (紮實化：上下文感知)
    const context = blackboard.getSummaryForContext();
    blackboard.recordThought(this.name, `開始處理任務: ${task}。已讀取 ${context.length} 字元的背景資訊。`);

    try {
      // 2. 執行實體邏輯
      const result = await executor(context);

      // 3. 執行後：回報事實與思考痕跡 (紮實化：知識閉環)
      blackboard.updateFact(`last_result_${this.name}`, result, this.name);
      blackboard.recordThought(this.name, `任務成功完成。結果摘要: ${JSON.stringify(result).substring(0, 100)}...`);
      
      return { success: true, taskId, data: result };
    } catch (e) {
      console.error(`[${this.name}] 執行崩潰: ${e.message}`);
      blackboard.recordThought(this.name, `任務失敗。錯誤: ${e.message}`);
      return { success: false, taskId, error: e.message };
    }
  }
}
