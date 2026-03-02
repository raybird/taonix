import { blackboard } from "../../memory/blackboard.js";

/**
 * Taonix Achievement System (v22.0.0)
 * 負責追蹤、解鎖並記錄 Agent 團隊的集體榮譽。
 */
export class AchievementSystem {
  constructor() {
    this.achievements = {
      "iron_synergy": { name: "鐵血默契", condition: "synergy >= 90", desc: "Agent 小隊默契達到極高水平。" },
      "quality_guardian": { name: "質量守護者", condition: "eval_score >= 95", desc: "產出極高品質的工程成果。" },
      "healing_master": { name: "自癒大師", condition: "context_recovery_count >= 5", desc: "多次成功從系統崩潰中還原任務。" }
    };
    this.unlocked = [];
  }

  /**
   * 檢查並解鎖成就
   */
  checkAchievements(metrics) {
    console.log("[Achievement] 正在評估團隊表現...");
    
    const facts = blackboard.getFacts();
    const synergyMatrix = facts.team_synergy_matrix?.value || {};
    
    // 範例檢查：是否有任何小隊達成鐵血默契
    const hasIronSynergy = Object.values(synergyMatrix).some(score => score >= 90);
    if (hasIronSynergy && !this.isUnlocked("iron_synergy")) {
      this.unlock("iron_synergy");
    }

    // 檢查任務質量
    if (metrics.evalScore >= 95 && !this.isUnlocked("quality_guardian")) {
      this.unlock("quality_guardian");
    }
  }

  unlock(key) {
    const achievement = this.achievements[key];
    this.unlocked.push({ ...achievement, unlockedAt: new Date().toISOString() });
    console.log(`[Achievement] 🏆 恭喜解鎖成就：${achievement.name}！`);
    
    blackboard.updateFact("team_achievements", this.unlocked, "achievement-system");
    blackboard.recordThought("achievement-system", `團隊成功解鎖了「${achievement.name}」。`);
  }

  isUnlocked(key) {
    return this.unlocked.some(a => a.name === this.achievements[key].name);
  }
}

export const achievementSystem = new AchievementSystem();
