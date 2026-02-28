import { loadSkills } from "./registry.js";
import { matchSkill } from "./matcher.js";
import { skillSandbox } from "./sandbox.js";
import { policyManager } from "./policy-manager.js";
import { skillArchitect } from "./skill-architect.js";

export class SkillEngine {
  constructor() {
    this.skills = new Map();
    this.history = [];
  }

  async init() {
    this.skills = await loadSkills();
    console.log(`[Skills] 已載入 ${this.skills.size} 個技能`);
  }

  async findSkill(context) {
    let matched = await matchSkill(context, this.skills);
    
    // v8.0.0: 如果沒有匹配到技能，但需求描述清晰，則觸發自動生成
    if (!matched && context.input && context.input.length > 5) {
      console.log("[Skills] 未找到匹配技能，啟動元進化引擎...");
      try {
        const evolution = await skillArchitect.draftSkill(context.input);
        if (evolution.success) {
          // 重新載入新技能
          this.skills = await loadSkills();
          matched = this.skills.get(evolution.name);
        }
      } catch (e) {
        console.warn("[Skills] 技能自動生成失敗:", e.message);
      }
    }
    
    return matched;
  }

  async execute(skillName, context) {
    const skill = this.skills.get(skillName);
    if (!skill) throw new Error(`技能不存在: ${skillName}`);

    let result;
    if (skill.scriptCode) {
      const permissions = policyManager.getPermissions(skillName);
      result = await skillSandbox.run(skill.scriptCode, context, {
        skillName: skill.name,
        allowFS: permissions.allowFS,
        allowNetwork: permissions.allowNetwork
      });
    } else {
      result = await skill.execute(context);
    }

    this.history.push({
      skill: skillName,
      context,
      result,
      timestamp: Date.now(),
    });

    return result;
  }

  getHistory() { return this.history; }
  getSkills() {
    return Array.from(this.skills.entries()).map(([name, skill]) => ({
      name,
      description: skill.description,
      triggers: skill.triggers,
    }));
  }
}

export async function createSkillEngine() {
  const engine = new SkillEngine();
  await engine.init();
  return engine;
}
