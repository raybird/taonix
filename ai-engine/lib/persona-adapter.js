import { synergyEngine } from "./synergy-engine.js";
import { collaborationCulture } from "./collaboration-culture.js";

/**
 * Taonix Adaptive Persona Adapter (v21.0.0)
 * 根據協作默契與任務背景，動態調整 Agent 的通訊人格。
 */
export class PersonaAdapter {
  /**
   * 獲取 Agent 的適應性人格 Prompt
   * @param {string} agentName 
   * @param {string} partnerName 
   * @param {object} taskMetadata 
   */
  getAdaptedPersona(agentName, partnerName, taskMetadata = {}) {
    const basePersona = collaborationCulture.getPersonaPrompt(agentName);
    const synergyScore = partnerName ? (synergyEngine.synergyMatrix[synergyEngine._getPairKey(agentName, partnerName)] || 50) : 50;
    
    let adaptation = "
[動態人格調整]: ";
    
    // 1. 基於默契的調整
    if (synergyScore > 80) {
      adaptation += "由於你與合作夥伴默契極高，請採取「高階技術黑話」與「極簡確認」模式，減少贅字。";
    } else if (synergyScore < 40) {
      adaptation += "由於雙方默契待培養，請採取「詳盡解釋」與「顯式步驟確認」模式，避免誤解。";
    } else {
      adaptation += "保持標準的專業協作語氣。";
    }

    // 2. 基於緊急度的調整 (v21.0.0 強化版)
    const activeTask = blackboard.getActiveTask();
    const priority = activeTask?.priority || taskMetadata.priority || "normal";

    if (priority === "critical" || priority === "high") {
      adaptation += ` [緊急模式] 目前任務優先級為 ${priority}，請展現極度專業、縮短回應鏈路、優先回報結論與風險阻斷。`;
    } else if (priority === "low") {
      adaptation += " [悠閒模式] 目前任務較不緊急，建議採取詳盡的教學模式，解釋每一步的代碼意圖與架構設計。";
    }

    return `${basePersona}${adaptation}`;
  }
}

export const personaAdapter = new PersonaAdapter();
