import { paths } from "../config/paths.js";
import fs from "fs";
import path from "path";
import { eventBus } from "../ai-engine/lib/event-bus.js";
import { blackboard } from "../memory/blackboard.js";

/**
 * Taonix Evolution Manager (v8.0.0)
 * 負責管控系統自我進化的版本、審計與回滾。
 */
export class EvolutionManager {
  constructor() {
    this.historyFile = require("../config/paths.js").paths.evolution_history.json;
    this.agentskillsDir = "/app/workspace/projects/taonix/skills/agentskills";
    this.history = [];
    this.load();
  }

  load() {
    try {
      if (fs.existsSync(this.historyFile)) {
        this.history = JSON.parse(fs.readFileSync(this.historyFile, "utf-8"));
      }
    } catch (e) {
      console.warn("[EvolutionManager] 無法載入進化歷史:", e.message);
    }
  }

  save() {
    try {
      const dir = path.dirname(this.historyFile);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(this.historyFile, JSON.stringify(this.history, null, 2));
    } catch (e) {
      console.warn("[EvolutionManager] 無法儲存進化歷史:", e.message);
    }
  }

  /**
   * 紀錄一次成功的演進
   */
  recordEvolution(skillName, metadata) {
    const entry = {
      timestamp: new Date().toISOString(),
      skillName,
      version: metadata.version || "1.0.0",
      action: "generated",
      details: metadata
    };
    this.history.push(entry);
    this.save();
    console.log(`[Evolution] 已紀錄技能 「${skillName}」 的演進快照。`);
    eventBus.publish("EVOLUTION_RECORDED", entry, "evolution-manager");
  }

  /**
   * 執行回滾 (Rollback)
   */
  async rollback(skillName) {
    console.log(`[Evolution] 正在回滾技能: ${skillName}...`);
    const skillPath = path.join(this.agentskillsDir, skillName);
    
    if (fs.existsSync(skillPath)) {
      // 簡單回滾策略：移除該技能目錄
      fs.rmSync(skillPath, { recursive: true, force: true });
      
      this.history.push({
        timestamp: new Date().toISOString(),
        skillName,
        action: "rollback",
        reason: "System stability"
      });
      this.save();
      
      blackboard.recordThought("evolution-manager", `技能 ${skillName} 已被回滾，系統恢復至穩定狀態。`);
      return true;
    }
    return false;
  }
}

export const evolutionManager = new EvolutionManager();
