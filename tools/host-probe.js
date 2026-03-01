import { envRunner } from "./environment-runner.js";
import { blackboard } from "../memory/blackboard.js";
import { eventBus } from "../ai-engine/lib/event-bus.js";

/**
 * Taonix Host Resource Probe (v11.0.0)
 * 負責感測宿主機的物理資源狀態（透過容器窗口）。
 */
export class HostProbe {
  /**
   * 執行全量資源掃描
   */
  async scan() {
    console.log("[HostProbe] 正在感測宿主機物理資源...");
    
    try {
      // 1. 檢查磁碟空間 (掛載點)
      const dfResult = await envRunner.run("df -h /app/workspace", "host-probe", "磁碟檢查");
      
      // 2. 檢查記憶體 (透過 /proc/meminfo 或 free)
      const memResult = await envRunner.run("free -m", "host-probe", "記憶體檢查");

      // 3. 檢查負載
      const loadResult = await envRunner.run("uptime", "host-probe", "負載檢查");

      const stats = {
        timestamp: new Date().toISOString(),
        disk: dfResult.output.split("
")[1],
        memory: memResult.output.split("
")[1],
        uptime: loadResult.output.trim()
      };

      // 1. 更新黑板
      blackboard.updateFact("host_physical_stats", stats, "host-probe");
      blackboard.recordThought("host-probe", "宿主機資源掃描完成。目前環境負載處於正常範圍。");

      // 2. 發布事件
      eventBus.publish("HOST_STATS_UPDATED", stats, "host-probe");

      return stats;
    } catch (e) {
      console.warn("[HostProbe] 資源感測受限:", e.message);
      return null;
    }
  }
}

export const hostProbe = new HostProbe();
