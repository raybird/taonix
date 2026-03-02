import { blackboard } from "../../memory/blackboard.js";

/**
 * Taonix Collaboration Synergy Engine (v21.0.0 - Persistent)
 * 負責追蹤、優化並持久化 Agent 團隊間的協作默契。
 */
export class SynergyEngine {
  constructor() {
    // v21.0.0 新增：從黑板載入先前沉澱的默契
    const savedMatrix = blackboard.getFacts().team_synergy_matrix;
    this.synergyMatrix = savedMatrix ? savedMatrix.value : {};
    console.log(`[Synergy] 默契引擎已載入，共 ${Object.keys(this.synergyMatrix).length} 組協作記憶。`);
  }

  /**
   * 記錄一次成功的協作
   */
  recordSuccess(agentA, agentB, taskId) {
    this.processFeedback(agentA, agentB, 100, true);
  }

  /**
   * 根據執行成果調整默契 (v21.0.0 Feedback Loop)
   */
  processFeedback(agentA, agentB, score, success) {
    const key = this._getPairKey(agentA, agentB);
    let adjustment = 0;

    if (success && score >= 90) adjustment = 10;
    else if (success && score >= 70) adjustment = 5;
    else if (!success) adjustment = -5;

    this.synergyMatrix[key] = Math.max(0, Math.min(100, (this.synergyMatrix[key] || 50) + adjustment));
    console.log(`[Synergy] ${key} 默契調整: ${adjustment > 0 ? "+" : ""}${adjustment} (新分數: ${this.synergyMatrix[key]})`);
    this._syncToBlackboard();
  }

  /**
   * 根據默契選擇隊友
   */
  suggestPartner(agentName) {
    const candidates = Object.entries(this.synergyMatrix)
      .filter(([k]) => k.includes(agentName))
      .sort((a, b) => b[1] - a[1]);

    return candidates.length > 0 ? candidates[0][0].replace(agentName, "").replace(":", "") : null;
  }

  _getPairKey(a, b) {
    return [a, b].sort().join(":");
  }

  _syncToBlackboard() {
    blackboard.updateFact("team_synergy_matrix", this.synergyMatrix, "synergy-engine");
  }
}

export const synergyEngine = new SynergyEngine();
