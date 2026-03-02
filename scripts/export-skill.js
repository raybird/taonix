import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, "..");
const SKILLS_DIR = "/app/workspace/.gemini/skills";

/**
 * Taonix Skill Exporter (v20.0.0)
 * 修正版：正確轉義模板字串。
 */
export function exportSkill() {
  const targetDir = path.join(SKILLS_DIR, "taonix-hub");
  if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

  const skillMdContent = `# Taonix Hub (Portable Edition)

## 概述
這是一個自動導出的 Taonix 技能包。

## 安裝位置
- **Source**: ${PROJECT_ROOT}
- **Server**: node ${path.join(PROJECT_ROOT, "mcp-server/index.js")}

## 關鍵工具
### taonix_hub(intent: string)
將任務意圖交給 Taonix 智慧樞紐執行。

## 靈魂原則
1. 封裝性：外部僅對接樞紐，專家調度由內部完成。
2. 心智同步：所有事實自動記錄於黑板。
`;

  fs.writeFileSync(path.join(targetDir, "SKILL.md"), skillMdContent);
  console.log("✅ Taonix 技能包已導出。");
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  exportSkill();
}
