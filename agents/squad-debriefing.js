import { eventBus } from "../ai-engine/lib/event-bus.js";
import { blackboard } from "../memory/blackboard.js";
import { AICaller } from "../ai-engine/lib/ai-caller.js";
import { experienceBase } from "../memory/experience-base.js";

/**
 * Taonix Squad Debriefing (v6.0.0)
 * 負責在重大任務完成後，自動進行後驗總結與集體經驗提取。
 */
export class SquadDebriefing {
  constructor() {
    this.aiCaller = new AICaller();
    this.init();
  }

  init() {
    console.log("[Debriefing] 小隊後驗總結系統已啟動...");
    eventBus.subscribe("TASK_COMPLETED", async (event) => {
      // 僅針對複雜或成功小隊任務進行深度總結
      await this.runDebrief(event.payload);
    });
  }

  async runDebrief(payload) {
    const { taskId, result, agent } = payload;
    
    // 獲取黑板上的推理鏈路
    const thoughts = blackboard.getRecentThoughts(10);
    const thoughtContext = thoughts.map(t => `[${t.agent}] ${t.content}`).join("
");

    console.log(`[Debriefing] 正在為任務 ${taskId} 生成集體經驗總結...`);

    const prompt = `你是一個集體智慧分析師。請根據以下任務結果與 Agent 推理過程，總結出這次協作的 1 個成功關鍵與 1 個未來改進點。
    
任務: ${taskId}
最終結果: ${JSON.stringify(result)}
推理鏈路:
${thoughtContext}`;

    const debrief = await this.aiCaller.call(prompt);

    if (!debrief.error) {
      const summary = debrief.content;
      
      // 1. 寫入黑板作為長期智慧
      blackboard.recordThought("debriefing", `任務 ${taskId} 經驗提取：
${summary}`);
      
      // 2. 更新經驗庫備註
      // (此處假設 recordSession 已由 AutoScorer 執行，我們僅補充細節)
      console.log(`[Debriefing] 成功為 ${taskId} 提取經驗。`);
    }
  }
}

export const squadDebriefing = new SquadDebriefing();
