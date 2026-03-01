import { AICaller } from "./ai-caller.js";
import { intentLibrary } from "../../memory/intent-library.js";

/**
 * Taonix Semantic Validator (v17.0.0)
 * 負責在樞紐層級攔截模糊、非法或超出能力的意圖。
 */
export class SemanticValidator {
  constructor() {
    this.ai = new AICaller();
  }

  /**
   * 驗證意圖是否可執行
   * @param {string} intent 
   */
  async validate(intent) {
    console.log(`[Validator] 正在預審意圖: "${intent.substring(0, 50)}..."`);

    // 1. 獲取模板參考
    const templates = intentLibrary.templates;
    const templateContext = Object.entries(templates)
      .map(([k, v]) => `- ${k}: ${v}`)
      .join("
");

    // 2. AI 語義判定
    const prompt = `你是一個嚴格的 AI 任務網關。請判斷以下意圖是否明確且可由目前的工程 Agent (coder, oracle, explorer, reviewer) 執行。
參考模板庫：
${templateContext}

意圖：${intent}

請返回 JSON 格式：
{
  "valid": boolean,
  "reason": "如果不合法，請說明原因",
  "matched_template": "key or null",
  "confidence": 0-1
}`;

    try {
      const res = await this.ai.call(prompt);
      const decision = JSON.parse(res.content);
      
      if (!decision.valid && decision.confidence > 0.8) {
        return { success: false, error: decision.reason };
      }

      return { success: true, decision };
    } catch (e) {
      console.warn("[Validator] 警告：AI 預審超時或解析失敗，採取保守通過策略。");
      return { success: true, note: "fallback_pass" };
    }
  }
}

export const semanticValidator = new SemanticValidator();
