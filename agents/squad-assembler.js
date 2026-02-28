import { agentRegistry } from "./registry.js";
import { eventBus } from "../ai-engine/lib/event-bus.js";
import { blackboard } from "../memory/blackboard.js";
import { experienceBase } from "../memory/experience-base.js";

/**
 * Taonix Squad Assembler (v5.0.0+)
 * 負責根據任務需求與 Agent 歷史表現，自動動態組建最優專家小隊。
 */
export class SquadAssembler {
  /**
   * 組建小隊
   * @param {string} taskId 任務 ID
   * @param {string[]} requiredCapabilities 所需能力列表
   */
  assemble(taskId, requiredCapabilities) {
    console.log(`[SquadAssembler] 正在分析歷史數據並為任務 ${taskId} 招募最優專家...`);
    
    const members = [];
    const missing = [];

    requiredCapabilities.forEach(cap => {
      const candidates = agentRegistry.findAgentsByCapability(cap);
      if (candidates.length > 0) {
        // 評分策略：成功率 * 0.6 + 平均得分 * 0.4
        const scoredCandidates = candidates.map(agent => {
          const stats = experienceBase.getAgentPerformance(agent.name);
          const successRate = stats.totalTasks > 0 ? stats.successCount / stats.totalTasks : 0.5;
          const score = (successRate * 6) + (stats.avgScore * 0.8);
          return { name: agent.name, score };
        });

        // 挑選評分最高者
        scoredCandidates.sort((a, b) => b.score - a.score);
        members.push(scoredCandidates[0].name);
      } else {
        missing.push(cap);
      }
    });

    if (missing.length > 0) {
      console.warn(`[SquadAssembler] 警告: 缺少具備以下能力的 Agent: ${missing.join(", ")}`);
    }

    const squad = {
      taskId,
      squadId: `squad_${Date.now()}`,
      members: [...new Set(members)],
      createdAt: new Date().toISOString()
    };

    // 1. 紀錄到黑板
    blackboard.updateFact(`active_squad_${taskId}`, squad, "squad-assembler");
    blackboard.recordThought("squad-assembler", `成功為任務 ${taskId} 組建小隊。成員：${squad.members.join(", ")}。`);

    // 2. 發布事件
    eventBus.publish("SQUAD_FORMED", squad, "squad-assembler");

    return squad;
  }
}

export const squadAssembler = new SquadAssembler();
