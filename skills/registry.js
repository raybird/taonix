import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const skillFiles = [
  "brainstorming",
  "systematic-debugging",
  "test-driven-development",
  "receiving-code-review",
  "requesting-code-review",
  "writing-plans",
  "executing-plans",
  "verification-before-completion",
];

export async function loadSkills() {
  const skills = new Map();

  for (const file of skillFiles) {
    try {
      const module = await import(`./skills/${file}.js`);
      const skill = module.default || module;

      if (skill && skill.name) {
        skills.set(skill.name, skill);
        console.log(`[Registry] 載入技能: ${skill.name}`);
      }
    } catch (e) {
      console.warn(`[Registry] 無法載入技能 ${file}: ${e.message}`);
    }
  }

  return skills;
}

export function registerSkill(skill) {
  console.log(`[Registry] 註冊技能: ${skill.name}`);
}
