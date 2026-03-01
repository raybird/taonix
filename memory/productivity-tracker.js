import fs from "fs";
import path from "path";
import { eventBus } from "../ai-engine/lib/event-bus.js";

/**
 * Taonix Productivity Tracker (v10.0.0)
 * 負責量化 AI 助理為使用者節省的時間與產出的價值。
 */
export class ProductivityTracker {
  constructor() {
    this.statsFile = "/app/workspace/projects/taonix/.data/productivity_stats.json";
    this.stats = {
      totalTasksCompleted: 0,
      estimatedHoursSaved: 0,
      totalAutoEvolutions: 0,
      lastTaskTimestamp: null
    };
    this.load();
    this.init();
  }

  load() {
    try {
      if (fs.existsSync(this.statsFile)) {
        this.stats = JSON.parse(fs.readFileSync(this.statsFile, "utf-8"));
      }
    } catch (e) {
      console.warn("[Productivity] 無法載入統計:", e.message);
    }
  }

  save() {
    try {
      const dir = path.dirname(this.statsFile);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(this.statsFile, JSON.stringify(this.stats, null, 2));
    } catch (e) {
      console.warn("[Productivity] 無法儲存統計:", e.message);
    }
  }

  init() {
    console.log("[Productivity] 生產力追蹤器已啟動...");
    
    // 監聽任務完成
    eventBus.subscribe("TASK_COMPLETED", (event) => {
      this.recordTask(event.payload);
    });

    // 監聽元進化
    eventBus.subscribe("EVOLUTION_RECORDED", () => {
      this.stats.totalAutoEvolutions += 1;
      this.save();
    });
  }

  recordTask(payload) {
    this.stats.totalTasksCompleted += 1;
    
    // 根據任務類型估算節省時間 (小時)
    // 簡單模型：基礎 0.2h + 複雜度加成
    let saved = 0.2;
    if (payload.parentTaskId) saved += 0.3; // 長程任務節省更多上下文切換
    
    this.stats.estimatedHoursSaved += saved;
    this.stats.lastTaskTimestamp = new Date().toISOString();
    this.save();
    
    console.log(`[Productivity] 任務完成！累計節省人力: ${this.stats.estimatedHoursSaved.toFixed(2)} 小時`);
  }
}

export const productivityTracker = new ProductivityTracker();
