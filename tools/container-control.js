import fs from "fs";
import path from "path";
import { eventBus } from "../ai-engine/lib/event-bus.js";
import { blackboard } from "../memory/blackboard.js";

/**
 * Taonix Cluster Controller (v12.0.0)
 * 負責向外部叢集發送控制指令（重啟、停止、啟動）。
 */
export class ClusterController {
  constructor() {
    this.signalDir = "/app/workspace/.data/control_signals";
    if (!fs.existsSync(this.signalDir)) fs.mkdirSync(this.signalDir, { recursive: true });
  }

  /**
   * 發送重啟指令
   * @param {string} containerName 
   */
  async restartContainer(containerName) {
    console.log(`[ClusterCtrl] 正在對容器 ${containerName} 發送重啟信號...`);
    
    const signal = {
      id: `sig_${Date.now()}`,
      action: "restart",
      target: containerName,
      timestamp: new Date().toISOString(),
      priority: "high"
    };

    try {
      const signalPath = path.join(this.signalDir, `${containerName}_restart.json`);
      fs.writeFileSync(signalPath, JSON.stringify(signal, null, 2));
      
      blackboard.recordThought("cluster-ctrl", `已投放重啟指令至 ${signalPath}。待宿主機代理執行。`);
      eventBus.publish("CONTROL_SIGNAL_SENT", signal, "cluster-ctrl");
      
      return { success: true, signalId: signal.id };
    } catch (e) {
      console.error("[ClusterCtrl] 指令投放失敗:", e.message);
      return { success: false, error: e.message };
    }
  }

  /**
   * 清理已執行的信號
   */
  cleanupSignals() {
    // 預留給宿主機回報執行完畢後的清理邏輯
  }
}

export const clusterController = new ClusterController();
