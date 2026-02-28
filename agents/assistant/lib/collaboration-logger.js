import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const COLLAB_LOG_PATH = "/app/workspace/projects/taonix/.data/collaboration_logs.json";

export class CollaborationLogger {
  constructor() {
    this.logs = [];
    this.load();
  }

  load() {
    try {
      if (fs.existsSync(COLLAB_LOG_PATH)) {
        this.logs = JSON.parse(fs.readFileSync(COLLAB_LOG_PATH, "utf-8"));
      }
    } catch (e) {
      console.warn("[CollabLogger] 無法載入日誌:", e.message);
    }
  }

  save() {
    try {
      const dir = path.dirname(COLLAB_LOG_PATH);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(COLLAB_LOG_PATH, JSON.stringify(this.logs.slice(0, 100), null, 2));
    } catch (e) {
      console.warn("[CollabLogger] 無法儲存日誌:", e.message);
    }
  }

  /**
   * 記錄協作事件
   * @param {string} taskId 任務 ID
   * @param {string} agent Agent 名稱
   * @param {string} action 動作 (start|handover|complete|error)
   * @param {object} details 詳細資訊
   */
  logEvent(taskId, agent, action, details = {}) {
    const entry = {
      timestamp: new Date().toISOString(),
      taskId,
      agent,
      action,
      details
    };
    this.logs.unshift(entry);
    this.save();
    console.log(`[CollabLog] ${agent} -> ${action} (Task: ${taskId})`);
    return entry;
  }

  getLogsByTask(taskId) {
    return this.logs.filter(l => l.taskId === taskId);
  }

  getRecentLogs(limit = 10) {
    return this.logs.slice(0, limit);
  }
}

export const collaborationLogger = new CollaborationLogger();
