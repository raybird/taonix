import fs from "fs";
import path from "path";
import { paths } from "../../config/paths.js";
import { blackboard } from "../../memory/blackboard.js";

/**
 * Taonix Resource Garbage Collector (v16.0.0)
 * 負責清理過期的事實與過大的日誌，確保系統輕量化。
 */
export class ResourceGC {
  constructor() {
    this.maxLogLines = 5000;
    this.init();
  }

  init() {
    console.log("[GC] 資源回收器已啟動...");
    // 每小時執行一次清理
    setInterval(() => this.collect(), 3600000);
  }

  async collect() {
    console.log("[GC] 正在執行例行數據回收...");
    
    // 1. 清理日誌
    if (fs.existsSync(paths.eventLogs)) {
      const logs = fs.readFileSync(paths.eventLogs, "utf-8").split("
");
      if (logs.length > this.maxLogLines) {
        fs.writeFileSync(paths.eventLogs, logs.slice(-this.maxLogLines).join("
"));
        blackboard.recordThought("gc", `已截斷事件日誌至最後 ${this.maxLogLines} 行。`);
      }
    }

    // 2. 清理黑板過期事實
    const facts = blackboard.getFacts();
    const now = Date.now();
    for (const [key, fact] of Object.entries(facts)) {
      const factTime = new Date(fact.updated).getTime();
      // 清理超過 48 小時的效能數據
      if (key.startsWith("performance_") && (now - factTime > 172800000)) {
        delete facts[key];
      }
    }
    blackboard.save();
  }
}

export const resourceGC = new ResourceGC();
