import { loadSkills } from "./registry.js";
import { matchSkill } from "./matcher.js";

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

    const result = await skill.execute(context);

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
