import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SOURCE_DIR = path.resolve(__dirname, "skills");
const TARGET_DIR = path.resolve(__dirname, "agentskills");

async function generate() {
  if (!fs.existsSync(TARGET_DIR)) fs.mkdirSync(TARGET_DIR, { recursive: true });

  const files = fs.readdirSync(SOURCE_DIR).filter(f => f.endsWith(".js"));

  for (const file of files) {
    const filePath = path.join(SOURCE_DIR, file);
    const module = await import(`file://${filePath}`);
    const skill = module.default;

    const skillDir = path.join(TARGET_DIR, skill.name);
    if (!fs.existsSync(skillDir)) fs.mkdirSync(skillDir, { recursive: true });

    // 構建 Instructions 區塊
    let instructions = "當使用者提到相關關鍵字或意圖時，Agent 應遵循以下步驟：\n";
    if (skill.steps) {
      instructions += skill.steps.map(s => `- ${s}`).join("\n");
    }
    if (skill.phases) {
      instructions += "\n" + skill.phases.map(p => `### Phase ${p.phase}: ${p.name}\n${p.steps.map(s => `- ${s}`).join("\n")}`).join("\n\n");
    }

    // 1. 生成 SKILL.md
    const skillMd = [
      "---",
      `name: ${skill.name}`,
      `description: ${skill.description}`,
      "metadata:",
      `  triggers: ${JSON.stringify(skill.triggers || [])}`,
      `  keywords: ${JSON.stringify(skill.keywords || [])}`,
      `  intentTypes: ${JSON.stringify(skill.intentTypes || [])}`,
      '  version: "1.0.0"',
      "---",
      "",
      `# ${skill.name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}`,
      "",
      "## Description",
      skill.description,
      "",
      "## Instructions",
      instructions,
      "",
      "## Recommended Agents",
      (skill.recommendedAgents || skill.requiredAgents || []).join(', '),
      ""
    ].join("\n");

    fs.writeFileSync(path.join(skillDir, "SKILL.md"), skillMd);

    // 2. 建立 scripts 目錄並複製原始邏輯
    const scriptDir = path.join(skillDir, "scripts");
    if (!fs.existsSync(scriptDir)) fs.mkdirSync(scriptDir, { recursive: true });
    fs.copyFileSync(filePath, path.join(scriptDir, "main.js"));

    console.log(`[AgentSkills] 已生成技能: ${skill.name}`);
  }
}

generate().catch(console.error);
