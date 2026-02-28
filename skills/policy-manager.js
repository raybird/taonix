import fs from "fs";
import path from "path";

/**
 * Taonix Skill Policy Manager (v4.5.0)
 * 負責管理第三方技能的權限策略。
 */
export class PolicyManager {
  constructor() {
    this.policyFile = "/app/workspace/projects/taonix/.data/skill_policies.json";
    this.policies = {};
    this.load();
  }

  load() {
    try {
      if (fs.existsSync(this.policyFile)) {
        this.policies = JSON.parse(fs.readFileSync(this.policyFile, "utf-8"));
      }
    } catch (e) {
      console.warn("[PolicyManager] 無法載入策略:", e.message);
    }
  }

  save() {
    try {
      const dir = path.dirname(this.policyFile);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(this.policyFile, JSON.stringify(this.policies, null, 2));
    } catch (e) {
      console.warn("[PolicyManager] 無法儲存策略:", e.message);
    }
  }

  /**
   * 獲取技能權限
   * @param {string} skillName 
   */
  getPermissions(skillName) {
    return this.policies[skillName] || { allowFS: false, allowNetwork: false };
  }

  /**
   * 授權技能
   */
  grantPermission(skillName, permissions) {
    this.policies[skillName] = {
      ...this.getPermissions(skillName),
      ...permissions,
      updatedAt: new Date().toISOString()
    };
    this.save();
    console.log(`[PolicyManager] 已更新技能 「${skillName}」 的權限。`);
  }
}

export const policyManager = new PolicyManager();
