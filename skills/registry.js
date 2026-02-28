import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const AGENTSKILLS_DIR = path.join(__dirname, "agentskills");

const skillFiles = [
  "brainstorming",
  "systematic-debugging",
  "test-driven-development",
  "receiving-code-review",
  "requesting-code-review",
  "writing-plans",
  "executing-plans",
  "verification-before-completion",
  "agent-coordinator",
  "security-audit",
  "doc-generator",
  "performance-optimization",
];

/**
 * 解析 SKILL.md 中的 YAML Frontmatter
 */
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  
  const yaml = match[1];
  const metadata = {};
  yaml.split("\n").forEach(line => {
    const [key, ...valueParts] = line.split(":");
    if (key && valueParts.length > 0) {
      const value = valueParts.join(":").trim();
      // 簡單處理 JSON 字串
      if (value.startsWith("[") && value.endsWith("]")) {
        try {
          metadata[key.trim()] = JSON.parse(value.replace(/'/g, '"'));
        } catch {
          metadata[key.trim()] = value;
        }
      } else {
        metadata[key.trim()] = value.replace(/^"(.*)"$/, "$1");
      }
    }
  });
  return metadata;
}

export async function loadSkills() {
  const skills = new Map();

  // 1. 優先載入 Agentskills.io 格式 (標準化)
  if (fs.existsSync(AGENTSKILLS_DIR)) {
    const dirs = fs.readdirSync(AGENTSKILLS_DIR);
    for (const dirName of dirs) {
      try {
        const skillPath = path.join(AGENTSKILLS_DIR, dirName);
        const mdPath = path.join(skillPath, "SKILL.md");
        const scriptPath = path.join(skillPath, "scripts", "main.js");

        if (fs.existsSync(mdPath)) {
          const content = fs.readFileSync(mdPath, "utf-8");
          const metadata = parseFrontmatter(content);
          
          if (metadata && metadata.name) {
            // 載入腳本實作
            let execute = async (ctx) => ({ status: "not_implemented", ...metadata });
            if (fs.existsSync(scriptPath)) {
              const module = await import(`file://${scriptPath}`);
              const impl = module.default || module;
              if (impl.execute) execute = impl.execute;
            }

            skills.set(metadata.name, {
              ...metadata,
              execute,
              isStandard: true
            });
            console.log(`[Registry] 載入標準技能: ${metadata.name}`);
          }
        }
      } catch (e) {
        console.warn(`[Registry] 無法載入標準技能 ${dirName}: ${e.message}`);
      }
    }
  }

  // 2. 回退載入舊格式 (相容性)
  for (const file of skillFiles) {
    if (skills.has(file)) continue; // 如果標準版已存在則跳過
    
    try {
      const module = await import(`./skills/${file}.js`);
      const skill = module.default || module;

      if (skill && skill.name) {
        skills.set(skill.name, skill);
        console.log(`[Registry] 載入舊版技能: ${skill.name}`);
      }
    } catch (e) {
      // 某些技能可能已經完全遷移
    }
  }

  return skills;
}

export function registerSkill(skill) {
  console.log(`[Registry] 註冊技能: ${skill.name}`);
}
