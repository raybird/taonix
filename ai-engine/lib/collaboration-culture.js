import { blackboard } from "../../memory/blackboard.js";

/**
 * Taonix Collaboration Culture Engine (v18.0.0)
 * 負責定義 Agent 團隊的協作價值觀與通訊人格。
 */
export class CollaborationCulture {
  constructor() {
    this.coreValues = {
      tone: "professional_yet_friendly",
      prioritize: "robustness_over_speed",
      communication: "explicit_and_contextual",
      conflict_resolution: "evidence_based_arbitration"
    };
    this.agentPersonalities = {
      coder: "實作導向，注重代碼潔癖與單元測試。",
      oracle: "深思熟慮，提供全局架構視角與風險預警。",
      reviewer: "細節控，嚴格把關商用合規性與型別安全。",
      explorer: "好奇心強，擅長發掘趨勢與外部知識。",
      assistant: "協調者，負責意圖對齊與資源平衡。"
    };
  }

  /**
   * 初始化文化事實
   */
  init() {
    console.log("[Culture] 協作文化引擎啟動：工程師文化已就緒。");
    blackboard.updateFact("team_culture", this.coreValues, "culture-engine");
    blackboard.updateFact("agent_personalities", this.agentPersonalities, "culture-engine");
    blackboard.recordThought("culture-engine", "團隊文化已確立：我們追求紮實、穩定且具備商用價值的工程實踐。");
  }

  /**
   * 獲取 Agent 的引導提示
   * @param {string} agentName 
   */
  getPersonaPrompt(agentName) {
    const persona = this.agentPersonalities[agentName] || "通用的專業 Agent。";
    return `你的人格設定：${persona}
團隊價值觀：${JSON.stringify(this.coreValues)}`;
  }
}

export const collaborationCulture = new CollaborationCulture();
