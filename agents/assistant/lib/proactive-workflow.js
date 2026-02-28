import { AICaller } from "../../../ai-engine/lib/ai-caller.js";
import { knowledgeBridge } from "./knowledge-bridge.js";

export class ProactiveWorkflow {
  constructor() {
    this.aiCaller = new AICaller();
    this.monitors = [];
  }

  async analyzeState(environmentState) {
    const prompt = `你是一個主動式 AI 助理。請根據以下環境狀態，分析是否有任何需要主動執行的任務或建議。請返回 JSON 格式：{ "actionRequired": boolean, "tasks": [ { "title": string, "priority": "low"|"medium"|"high" } ] }：

${JSON.stringify(environmentState)}`;
    
    const result = await this.aiCaller.call(prompt);
    if (result.error) return { actionRequired: false, tasks: [] };

    try {
      return JSON.parse(result.content);
    } catch {
      return { actionRequired: false, tasks: [] };
    }
  }

  async runCycle(context) {
    console.log("[ProactiveWorkflow] 啟動狀態分析...");
    const sharedKnowledge = knowledgeBridge.list();
    
    const analysis = await this.analyzeState({
      sharedKnowledge,
      context,
      timestamp: new Date().toISOString()
    });

    if (analysis.actionRequired && analysis.tasks.length > 0) {
      console.log(`[ProactiveWorkflow] 偵測到 ${analysis.tasks.length} 個建議任務：`);
      analysis.tasks.forEach(t => {
        console.log(` - [${t.priority}] ${t.title}`);
        // 將任務存入知識橋接器，供其他 Agent 參考
        knowledgeBridge.share("proactive-workflow", `suggested_task:${Date.now()}`, t);
      });
      return analysis.tasks;
    }

    return [];
  }
}

export const proactiveWorkflow = new ProactiveWorkflow();
