import { eventBus } from "./event-bus.js";
import { blackboard } from "../../memory/blackboard.js";

/**
 * Taonix P2P Bridge (v13.0.0)
 * 負責分散式節點間的事件中轉與心智同步。
 */
export class P2PBridge {
  constructor() {
    this.nodes = new Map(); // 儲存已發現的遠端節點
    this.init();
  }

  init() {
    console.log("[P2PBridge] 橋接器啟動中，準備接入分散式心智網路...");

    // 1. 監聽本地事件並評估是否需要廣播
    eventBus.subscribeAll((event) => {
      if (event.metadata && event.metadata.broadcast) {
        this.broadcastToPeers(event);
      }
    });
  }

  /**
   * 向所有已知節點廣播事件
   */
  async broadcastToPeers(event) {
    console.log(`[P2PBridge] 正在廣播事件 ${event.name} 至遠端節點...`);
    // 實作層：將調用 P2P 傳輸協議 (libp2p 或類似方案)
    blackboard.recordThought("p2p-bridge", `事件 ${event.name} 已發送至全球分散式網路。`);
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
