import { blackboard } from "../../memory/blackboard.js";

/**
 * Taonix Priority Manager (v16.0.0)
 * 負責定義與查詢 Agent 任務的優先級權重。
 */
export class PriorityManager {
  constructor() {
    this.weights = {
      "self-healer": 100, // 最高優先：系統生存
      "arbitrator": 90,   // 高：決策中樞
      "coder": 70,        // 中：實作任務
      "reviewer": 50,     // 低：背景審查
      "explorer": 40,     // 低：外部搜尋
      "designer": 30      // 最低：美化任務
    };
  }

  /**
   * 獲取任務的數值優先級
   * @param {string} agentName 
   */
  getWeight(agentName) {
    return this.weights[agentName] || 50;
  }

  /**
   * 判斷是否為「可掛起」任務
   */
  isSuspendable(agentName) {
    return this.getWeight(agentName) < 60;
  }

  /**
   * 更新優先級 Facts 到黑板
   */
  syncToBlackboard() {
    blackboard.updateFact("priority_model", this.weights, "priority-manager");
  }
}

export const priorityManager = new PriorityManager();
