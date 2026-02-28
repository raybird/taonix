import { agentRegistry } from "./registry.js";
import { eventBus } from "../ai-engine/lib/event-bus.js";
import { blackboard } from "../memory/blackboard.js";

/**
 * Taonix Squad Assembler (v5.0.0)
 * 負責根據任務需求，自動動態組建最適合的專家小隊。
 */
export class SquadAssembler {
  /**
   * 組建小隊
   * @param {string} taskId 任務 ID
   * @param {string[]} requiredCapabilities 所需能力列表 (如: ["coding", "testing"])
   */
  assemble(taskId, requiredCapabilities) {
    console.log(`[SquadAssembler] 正在為任務 ${taskId} 招募專家... (所需能力: ${requiredCapabilities.join(", ")})`);
    
    const members = [];
    const missing = [];

    requiredCapabilities.forEach(cap => {
      const candidates = agentRegistry.findAgentsByCapability(cap);
      if (candidates.length > 0) {
        // 簡單策略：選擇第一個可用的 Agent
        members.push(candidates[0].name);
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
