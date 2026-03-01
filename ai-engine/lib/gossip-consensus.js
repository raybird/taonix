import { blackboard } from "../../memory/blackboard.js";
import { eventBus } from "./event-bus.js";

/**
 * Taonix Gossip Consensus (v18.0.0)
 * 負責確保分散式節點間黑板事實的一致性。
 */
export class GossipConsensus {
  constructor() {
    this.init();
  }

  init() {
    console.log("[Consensus] 一致性校驗器啟動，正在監視跨節點事實震盪...");

    // 監聽來自 P2P 的事實更新
    eventBus.subscribe("FACT_DISCOVERED", (event) => {
      this.validateFact(event.payload, event.source);
    });
  }

  /**
   * 校驗事實一致性
   */
  validateFact(payload, source) {
    const localFacts = blackboard.getFacts();
    const localFact = localFacts[payload.key];

    if (localFact) {
      // 1. 衝突檢測：如果值不同且來源非本地
      if (JSON.stringify(localFact.value) !== JSON.stringify(payload.value)) {
        console.warn(`[Consensus] 偵測到事實衝突: ${payload.key} (本地 vs ${source})`);
        this.resolveConflict(payload.key, localFact, payload, source);
      }
    }
  }

  /**
   * 衝突仲裁邏輯
   */
  resolveConflict(key, local, remote, remoteSource) {
    const localTime = new Date(local.updated).getTime();
    const remoteTime = new Date(remote.updated || Date.now()).getTime();

    // 簡單規則：時戳更新者勝 (LWW - Last Write Wins)
    if (remoteTime > localTime) {
      console.log(`[Consensus] 採納遠端事實 (${remoteSource})，執行本地黑板更新。`);
      blackboard.updateFact(key, remote.value, `consensus-from-${remoteSource}`);
    } else {
      console.log(`[Consensus] 保留本地事實，忽略來自 ${remoteSource} 的過期更新。`);
    }
  }
}

export const gossipConsensus = new GossipConsensus();
