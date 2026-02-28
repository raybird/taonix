import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

class SkillMarketplace {
  constructor() {
    this.skillsDir = path.join(__dirname, "skills");
    this.marketplaceDir = path.join(__dirname, "marketplace");
    this.externalSkills = new Map();
  }

  async initialize() {
    if (!fs.existsSync(this.marketplaceDir)) {
      fs.mkdirSync(this.marketplaceDir, { recursive: true });
    }
    await this.loadExternalSkills();
  }

  async loadExternalSkills() {
    const files = fs
      .readdirSync(this.marketplaceDir)
      .filter((f) => f.endsWith(".js"));

    for (const file of files) {
      try {
        const module = await import(`./marketplace/${file}`);
        const skill = module.default || module;

        if (skill && skill.name) {
          this.externalSkills.set(skill.name, skill);
          console.log(`[Marketplace] 載入外部技能: ${skill.name}`);
        }
      } catch (e) {
        console.warn(`[Marketplace] 無法載入 ${file}: ${e.message}`);
      }
    }
  }

  async installSkill(skillName, skillModule) {
    const fileName = `${skillName.toLowerCase().replace(/\s+/g, "-")}.js`;
    const filePath = path.join(this.marketplaceDir, fileName);

    const skillCode = this.generateSkillTemplate(skillName, skillModule);
    fs.writeFileSync(filePath, skillCode);

    await this.loadExternalSkills();
    return { success: true, name: skillName, path: filePath };
  }

  generateSkillTemplate(name, module) {
    return `// External Skill: ${name}
// Installed from marketplace
export default ${JSON.stringify(module, null, 2)};
`;
  }

  listSkills() {
    const agentskillsDir = path.join(__dirname, "..", "agentskills");
    let standardSkills = [];
    if (fs.existsSync(agentskillsDir)) {
      standardSkills = fs.readdirSync(agentskillsDir);
    }

    return {
      builtIn: [
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
      ],
      standardized: standardSkills,
      external: Array.from(this.externalSkills.keys()),
    };
  }

  getSkill(name) {
    if (this.externalSkills.has(name)) {
      return this.externalSkills.get(name);
    }
    return null;
  }

  removeSkill(name) {
    const fileName = `${name.toLowerCase().replace(/\s+/g, "-")}.js`;
    const filePath = path.join(this.marketplaceDir, fileName);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      this.externalSkills.delete(name);
      return { success: true, name };
    }
    return { success: false, error: "Skill not found" };
  }
}

export const skillMarketplace = new SkillMarketplace();
export default skillMarketplace;
