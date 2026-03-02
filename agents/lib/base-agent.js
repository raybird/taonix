import { blackboard } from "../../memory/blackboard.js";
import { AICaller } from "../../ai-engine/lib/ai-caller.js";
import { personaAdapter } from "../../ai-engine/lib/persona-adapter.js";

/**
 * Taonix Base Agent (v21.0.0 - Socially Aware)
 * 核心基類：具備黑板意識、成果自評價與語境感知的動態人格。
 */
export class BaseAgent {
  constructor(name) {
    this.name = name;
    this.ai = new AICaller();
  }

  async runTask(task, executor, partner = null) {
    const taskId = `task_${Date.now()}`;
    
    // v21.0.0 新增：獲取語境感知的適應性人格
    const adaptedPersona = personaAdapter.getAdaptedPersona(this.name, partner);
    console.log(`[${this.name}] 正在執行任務。語境人格: ${adaptedPersona.split("\n").pop()}`);

    // 設定適應性人格到 AI 背景
    this.ai.setSystemPrompt(adaptedPersona);

    blackboard.recordThought(this.name, `接收意圖: ${task}。協作夥伴: ${partner || "無"}。`);

    const context = blackboard.getSummaryForContext();

    try {
      const result = await executor(context);

      // 執行成果自評價
      const evalScore = await this.evaluateResult(task, result);
      
      blackboard.updateFact(`last_result_${this.name}`, {
        ...result,
        eval_score: evalScore,
        taskId,
        synergy_partner: partner
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
      return 70;
    }
  }
}
