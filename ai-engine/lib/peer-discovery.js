import { eventBus } from "./event-bus.js";
import { blackboard } from "../../memory/blackboard.js";

/**
 * Taonix Peer Discovery (v13.0.0)
 * 負責在分散式網路中尋找並驗證其他 Taonix 節點。
 */
export class PeerDiscovery {
  constructor() {
    this.activePeers = new Set();
    this.init();
  }

  init() {
    console.log("[Discovery] 節點發現服務已啟動，監聽 P2P 脈動...");
    
    // 定期廣播本機節點資訊
    setInterval(() => this.broadcastIdentity(), 30000);
  }

  /**
   * 廣播身份至 P2P 網路
   */
  async broadcastIdentity() {
    const identity = {
      nodeId: process.env.TAONIX_NODE_ID || `node_${Math.random().toString(36).substring(7)}`,
      capabilities: ["coder", "explorer", "p2p_relay"],
      timestamp: Date.now()
    };

    console.log(`[Discovery] 廣播本機身份: ${identity.nodeId}`);
    // 透過 P2PBridge 執行實體發送
    eventBus.publish("PEER_IDENTITY_BROADCAST", identity, "discovery");
  }

  /**
   * 處理發現的新節點
   */
  async onPeerFound(peerData) {
    if (!this.activePeers.has(peerData.nodeId)) {
      console.log(`[Discovery] 發現新遠端節點: ${peerData.nodeId}`);
      this.activePeers.add(peerData.nodeId);
      
      blackboard.updateFact(`remote_node_${peerData.nodeId}`, peerData, "discovery");
      blackboard.recordThought("discovery", `已建立與遠端節點 ${peerData.nodeId} 的初步信任。協作力增加。`);
      
      eventBus.publish("PEER_JOINED_MESH", peerData, "discovery");
    }
  }
}

export const peerDiscovery = new PeerDiscovery();
