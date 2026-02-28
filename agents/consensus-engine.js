import { eventBus } from "../ai-engine/lib/event-bus.js";
import { blackboard } from "../memory/blackboard.js";

/**
 * Taonix Consensus Engine (v5.0.0)
 * 負責小隊成員間對任務方案的達成共識。
 */
export class ConsensusEngine {
  constructor() {
    this.activeProposals = new Map();
  }

  /**
   * 發起任務提案
   * @param {string} squadId 小隊 ID
   * @param {object} plan 任務分解方案
   */
  proposePlan(squadId, plan) {
    const proposalId = `prop_${Date.now()}`;
    const proposal = {
      id: proposalId,
      squadId,
      plan,
      votes: new Map(), // agentName -> decision (approve/reject/suggest)
      status: "voting"
    };

    this.activeProposals.set(proposalId, proposal);
    
    console.log(`[Consensus] 發起新提案 ${proposalId} 給小隊 ${squadId}`);
    
    // 1. 紀錄到黑板
    blackboard.recordThought("consensus", `針對小隊 ${squadId} 發起任務共識提案。`);
    blackboard.updateFact(`proposal_${proposalId}`, proposal, "consensus");

    // 2. 廣播提案事件
    eventBus.publish("PLAN_PROPOSED", { proposalId, squadId, plan }, "consensus");

    return proposalId;
  }

  /**
   * 投票回饋
   */
  castVote(proposalId, agentName, decision, comment = "") {
    const proposal = this.activeProposals.get(proposalId);
    if (!proposal || proposal.status !== "voting") return;

    proposal.votes.set(agentName, { decision, comment });
    console.log(`[Consensus] Agent ${agentName} 對提案 ${proposalId} 投下: ${decision}`);

    // 檢查是否達成共識 (全體同意或過半)
    this.checkConsensus(proposalId);
  }

  checkConsensus(proposalId) {
    const proposal = this.activeProposals.get(proposalId);
    const squadFact = blackboard.getFacts()[`active_squad_${proposal.plan.taskId}`];
    if (!squadFact) return;

    const memberCount = squadFact.value.members.length;
    const approveCount = Array.from(proposal.votes.values()).filter(v => v.decision === "approve").length;

    if (approveCount === memberCount) {
      proposal.status = "approved";
      console.log(`[Consensus] 提案 ${proposalId} 已達成全體共識！`);
      eventBus.publish("PLAN_APPROVED", { proposalId, plan: proposal.plan }, "consensus");
      blackboard.updateFact(`final_plan_${proposalId}`, proposal.plan, "consensus");
    }
  }
}

export const consensusEngine = new ConsensusEngine();
