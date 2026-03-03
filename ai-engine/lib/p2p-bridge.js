import { eventBus } from "./event-bus.js";
import { blackboard } from "../../memory/blackboard.js";
import { trafficOptimizer } from "./traffic-optimizer.js";

/**
 * Taonix P2P Bridge (v23.0.0 - Optimized)
 * 負責分散式節點間的高效心智同步與頻寬管理。
 */
export class P2PBridge {
  constructor() {
    this.nodes = new Map();
    this.init();
  }

  init() {
    console.log("[P2PBridge] 橋接器啟動：正在監聽跨網同步請求...");

    eventBus.subscribeAll((event) => {
      if (event.metadata && event.metadata.broadcast) {
        this.broadcastToPeers(event);
      }
    });
  }

  /**
   * 向所有已知節點廣播事實 (具備頻寬優化)
   */
  async broadcastToPeers(event) {
    if (event.name === "FACT_UPDATED") {
      const { key, value } = event.payload;
      
      // v23.0.0 新增：指紋過濾，避免無謂重覆廣播
      if (!trafficOptimizer.shouldBroadcast(key, value)) return;

      const compressed = trafficOptimizer.compressPackage(event.payload);
      console.log(`[P2PBridge] 廣播優化後事實包: ${key} (Sig: ${compressed._sig})`);
      // 實際傳輸層調用...
    }
  }

  /**
   * 接收遠端事件
   */
  receiveFromPeer(remoteEvent) {
    console.log(`[P2PBridge] 收到遠端節點事件: ${remoteEvent.name}`);
    eventBus.publish(remoteEvent.name, remoteEvent.payload, `p2p:${remoteEvent.source}`);
  }
}

export const p2pBridge = new P2PBridge();
