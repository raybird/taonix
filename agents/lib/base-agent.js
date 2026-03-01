import { blackboard } from "../../memory/blackboard.js";
import { eventBus } from "../../ai-engine/lib/event-bus.js";
import { AICaller } from "../../ai-engine/lib/ai-caller.js";

/**
 * Taonix Base Agent (v17.0.0 - Self-Aware)
 * 核心基類：具備黑板意識、事件閉環與成果自評價能力。
 */
export class BaseAgent {
  constructor(name) {
    this.name = name;
    this.ai = new AICaller();
  }

  async runTask(task, executor) {
    const taskId = `task_${Date.now()}`;
    console.log(`[${this.name}] 正在執行: ${task}`);

    const context = blackboard.getSummaryForContext();
    blackboard.recordThought(this.name, `接收意圖: ${task}。正在調用實體邏輯...`);

    try {
      const result = await executor(context);

      // v17.0.0 新增：執行成果自評價
      const evalScore = await this.evaluateResult(task, result);
      
      blackboard.updateFact(`last_result_${this.name}`, {
        ...result,
        eval_score: evalScore,
        taskId
      }, this.name);

      blackboard.recordThought(this.name, `任務完成。評價得分: ${evalScore}/100。`);
      
      return { success: true, taskId, data: result, score: evalScore };
    } catch (e) {
      blackboard.recordThought(this.name, `執行失敗: ${e.message}`);
      return { success: false, taskId, error: e.message };
    }
  }

  async evaluateResult(intent, result) {
    const prompt = `你是一個嚴格的質量審計員。請根據原始意圖與執行結果，給出一個 0-100 的對齊得分。
意圖: ${intent}
結果: ${JSON.stringify(result).substring(0, 500)}
僅返回一個數字。`;
    
    try {
      const res = await this.ai.call(prompt);
      return parseInt(res.content.trim()) || 80;
    } catch {
      return 70; // 降級評分
    }
  }
}
