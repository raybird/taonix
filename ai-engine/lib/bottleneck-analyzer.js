import { eventBus } from "./event-bus.js";
import { blackboard } from "../../memory/blackboard.js";

/**
 * Taonix Bottleneck Analyzer (v15.0.0)
 * 負責自動診斷執行效能瓶頸並提出優化建議。
 */
export class BottleneckAnalyzer {
  constructor() {
    this.thresholdMs = 10000; // 10秒警告閾值
    this.init();
  }

  init() {
    console.log("[Bottleneck] 瓶頸分析器已啟動，監視黑板效能指標...");
    
    // 定期執行診斷 (每分鐘)
    setInterval(() => this.diagnose(), 60000);
  }

  async diagnose() {
    const facts = blackboard.getFacts();
    const perfFacts = Object.entries(facts).filter(([k]) => k.startsWith("performance_"));

    for (const [key, fact] of perfFacts) {
      const agent = key.replace("performance_", "");
      const duration = fact.value.lastDuration;

      if (duration > this.thresholdMs) {
        this.triggerAlert(agent, duration);
      }
    }
  }

  triggerAlert(agent, duration) {
    const alert = {
      agent,
      duration,
      level: "warning",
      suggestion: `偵測到 ${agent} 執行耗時異常 (${duration}ms)。建議：1. 檢查子進程資源限制 2. 優化 ${agent} 的代碼處理邏輯 3. 若為網路任務，請檢查連線狀態。`,
      timestamp: Date.now()
    };

    console.warn(`[Bottleneck] 發現效能瓶頸: ${agent} (${duration}ms)`);
    
    // 1. 更新黑板診斷事實
    blackboard.updateFact(`bottleneck_alert_${agent}`, alert, "bottleneck-analyzer");
    blackboard.recordThought("bottleneck-analyzer", `自動診斷完成：${agent} 存在顯著執行瓶頸。已發布警報。`);

    // 2. 發布事件
    eventBus.publish("PERFORMANCE_ALERT", alert, "bottleneck-analyzer");
  }
}

export const bottleneckAnalyzer = new BottleneckAnalyzer();
