import { eventBus } from "./event-bus.js";
import { p2pBridge } from "./p2p-bridge.js";
import { blackboard } from "../../memory/blackboard.js";

/**
 * Taonix Distributed Event Bus (v13.0.0)
 * 實現跨節點的事件廣播與狀態最終一致性。
 */
export class DistributedEventBus {
  constructor() {
    this.seenEvents = new Set(); // 防止 Gossip 迴圈
    this.init();
  }

  init() {
    console.log("[DistBus] 分散式總線已就緒，正在建立全球心智鏈路...");

    // 1. 監聽本地高優先級事件，自動升級為全球廣播
    eventBus.subscribeAll((event) => {
      if (this.shouldBroadcast(event)) {
        this.propagateToMesh(event);
      }
    });
  }

  /**
   * 判斷事件是否具備「全球價值」
   */
  shouldBroadcast(event) {
    const globalTypes = ["TASK_ASSIGNED", "BLACKBOARD_UPDATED", "CONFLICT_RESOLVED"];
    return globalTypes.includes(event.name) && !event.source.startsWith("p2p:");
  }

  /**
   * 透過 Gossip 協議傳播至 Mesh 網路
   */
  propagateToMesh(event) {
    // v16.0.1 Fix: 嚴格阻斷重複事件與遞迴廣播
    if (this.seenEvents.has(event.id)) {
      return; 
    }
    
    // 阻斷由 P2PBridge 或 DistBus 產生的遞迴事實
    if (event.source.includes("p2p") || event.source === "orchestrator") {
      return;
    }

    this.seenEvents.add(event.id);
    console.log(`[DistBus] 全球廣播事件: ${event.name} (${event.id})`);
    
    // 透過 P2P 橋接器發送
    p2pBridge.broadcastToPeers(event);
    
    // 10 分鐘後清理
    setTimeout(() => this.seenEvents.delete(event.id), 600000);
  }

  /**
   * 接收來自遠端的 Gossip 訊息
   */
  handleRemoteEvent(remoteEvent) {
    if (this.seenEvents.has(remoteEvent.id)) return;
    
    console.log(`[DistBus] 接收全球心智訊號: ${remoteEvent.name} 來自 ${remoteEvent.source}`);
    this.seenEvents.add(remoteEvent.id);
    
    // 注入本地總線
    eventBus.publish(remoteEvent.name, remoteEvent.payload, `p2p:${remoteEvent.source}`, remoteEvent.id);
  }
}

export const distributedEventBus = new DistributedEventBus();
