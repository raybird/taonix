import fs from "fs";
import path from "path";

/**
 * Taonix Collective Experience Base (v6.0.0)
 * 負責記錄與分析小隊協作的歷史經驗，實現集體學習。
 */
export class ExperienceBase {
  constructor() {
    this.storageFile = "/app/workspace/projects/taonix/.data/experience_base.json";
    this.experience = {
      sessions: [],      // 歷史協作會話
      agentStats: {}     // Agent 表現統計
    };
    this.load();
  }

  load() {
    try {
      if (fs.existsSync(this.storageFile)) {
        this.experience = JSON.parse(fs.readFileSync(this.storageFile, "utf-8"));
      }
    } catch (e) {
      console.warn("[ExperienceBase] 無法載入經驗庫:", e.message);
    }
  }

  save() {
    try {
      const dir = path.dirname(this.storageFile);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(this.storageFile, JSON.stringify(this.experience, null, 2));
    } catch (e) {
      console.warn("[ExperienceBase] 無法儲存經驗庫:", e.message);
    }
  }

  /**
   * 記錄一次協作結果
   */
  recordSession(squadId, taskId, members, result) {
    const session = {
      timestamp: new Date().toISOString(),
      squadId,
      taskId,
      members,
      success: result.success,
      score: result.score || (result.success ? 5 : 1),
      feedback: result.feedback || ""
    };

    this.experience.sessions.push(session);
    
    // 更新 Agent 統計
    members.forEach(agent => {
      if (!this.experience.agentStats[agent]) {
        this.experience.agentStats[agent] = { totalTasks: 0, successCount: 0, avgScore: 0 };
      }
      const stats = this.experience.agentStats[agent];
      stats.totalTasks += 1;
      if (result.success) stats.successCount += 1;
      stats.avgScore = ((stats.avgScore * (stats.totalTasks - 1)) + session.score) / stats.totalTasks;
    });

    this.save();
    console.log(`[ExperienceBase] 已紀錄小隊 ${squadId} 的協作經驗。`);
  }

  /**
   * 獲取 Agent 的推薦權重
   */
  getAgentPerformance(agentName) {
    return this.experience.agentStats[agentName] || { totalTasks: 0, successCount: 0, avgScore: 0 };
  }
}

export const experienceBase = new ExperienceBase();
