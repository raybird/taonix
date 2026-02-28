import fs from "fs";
import path from "path";
import { AICaller } from "../../../ai-engine/lib/ai-caller.js";

export class ContextGuard {
  constructor(options = {}) {
    this.threshold = options.threshold || 10000; // 預設 10k 字元觸發
    this.aiCaller = new AICaller();
  }

  async checkAndSummarize(sessionId, history) {
    const totalLength = history.reduce((sum, msg) => sum + (msg.content?.length || 0), 0);
    
    if (totalLength > this.threshold) {
      console.log(`[ContextGuard] 偵測到上下文長度 (${totalLength}) 超過閾值 (${this.threshold})，啟動自動摘要...`);
      return await this.summarize(history);
    }
    
    return null;
  }

  async summarize(history) {
    const prompt = `請根據以下對話歷史進行深度摘要，保留核心決策、重要事實、當前任務進度與使用者偏好。摘要應簡潔且具備高度結構化，以便 AI 後續參考：

${JSON.stringify(history)}`;
    
    const result = await this.aiCaller.call(prompt);
    
    if (result.error) {
      console.error("[ContextGuard] 摘要失敗:", result.error);
      return null;
    }
    
    return {
      type: "summary",
      content: result.content,
      timestamp: new Date().toISOString(),
      originalLength: history.length
    };
  }
}

export const contextGuard = new ContextGuard();
