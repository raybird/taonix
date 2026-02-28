import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const AGENTSKILLS_DIR = path.resolve(__dirname, "agentskills");

export class RemoteSkillLoader {
  constructor(targetDir = AGENTSKILLS_DIR) {
    this.targetDir = targetDir;
    if (!fs.existsSync(this.targetDir)) fs.mkdirSync(this.targetDir, { recursive: true });
  }

  async install(skillName, config) {
    const skillPath = path.join(this.targetDir, skillName);
    const scriptPath = path.join(skillPath, "scripts");
    if (!fs.existsSync(skillPath)) fs.mkdirSync(skillPath, { recursive: true });
    if (!fs.existsSync(scriptPath)) fs.mkdirSync(scriptPath, { recursive: true });
    fs.writeFileSync(path.join(skillPath, "SKILL.md"), config.skillMd);
    if (config.mainJs) fs.writeFileSync(path.join(scriptPath, "main.js"), config.mainJs);
    console.log("[RemoteLoader] 技能 「" + skillName + "」 已安裝成功。");
    return { success: true, path: skillPath };
  }

  async fetchAndInstall(url) {
    console.log("[RemoteLoader] 正在從 " + url + " 獲取技能定義...");
    const mockSkillName = "remote-example";
    const mockConfig = {
      skillMd: "---\nname: remote-example\ndescription: 來自遠端的測試技能\n---\n# Remote Example\n\n## Instructions\n1. 執行遠端指令",
      mainJs: "export default { execute: async (ctx) => ({ status: 'success', source: 'remote' }) };"
    };
    return await this.install(mockSkillName, mockConfig);
  }
}

if (import.meta.url === "file://" + process.argv[1]) {
  const loader = new RemoteSkillLoader();
  loader.fetchAndInstall("https://api.agentskills.io/v1/skills/example").catch(console.error);
}
