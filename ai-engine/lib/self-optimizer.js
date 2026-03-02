import { blackboard } from "../../memory/blackboard.js";
import { achievementSystem } from "./achievement-system.js";

/**
 * Taonix Self-Optimizer (v22.0.0)
 * 負責讓高榮譽 Agent 主動提交系統優化提案。
 */
export class SelfOptimizer {
  constructor() {
    this.proposals = [];
  }

  /**
   * 提交優化提案
   * @param {string} agentName 
   * @param {string} category 
   * @param {string} detail 
   */
  async submitProposal(agentName, category, detail) {
    // 1. 權限校驗：僅限獲得特定榮譽的 Agent
    const facts = blackboard.getFacts();
    const achievements = facts.team_achievements?.value || [];
    const isGuardian = achievements.some(a => a.name === "質量守護者");

    if (!isGuardian) {
      console.warn(`[Optimizer] Agent ${agentName} 榮譽不足，提案已拒絕。`);
      return { success: false, reason: "Insufficient honor" };
    }

    // 2. 建立提案
    const proposal = {
      id: `prop_${Date.now()}`,
      proposer: agentName,
      category,
      detail,
      status: "pending",
      timestamp: new Date().toISOString()
    };

    this.proposals.push(proposal);
    blackboard.updateFact("optimization_proposals", this.proposals, "self-optimizer");
    blackboard.recordThought("self-optimizer", `Agent ${agentName} 提交了優化提案：${category} - ${detail.substring(0, 30)}...`);
    
    return { success: true, proposalId: proposal.id };
  }
}

export const selfOptimizer = new SelfOptimizer();
