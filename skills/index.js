import { loadSkills } from "./registry.js";
import { matchSkill } from "./matcher.js";
import { skillSandbox } from "./sandbox.js";
import { policyManager } from "./policy-manager.js";

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
    const matched = await matchSkill(context, this.skills);
    return matched;
  }

  async execute(skillName, context) {
    const skill = this.skills.get(skillName);
    if (!skill) {
      throw new Error(`技能不存在: ${skillName}`);
    }

    let result;
    // 如果技能包含原始腳本碼 (通常是外部載入的)，則使用沙盒執行
    if (skill.scriptCode) {
      const permissions = policyManager.getPermissions(skillName);
      result = await skillSandbox.run(skill.scriptCode, context, {
        skillName: skill.name,
        allowFS: permissions.allowFS,
        allowNetwork: permissions.allowNetwork
      });
    } else {
      // 否則使用原生 execute 邏輯 (內建技能)
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

  getHistory() {
    return this.history;
  }

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
