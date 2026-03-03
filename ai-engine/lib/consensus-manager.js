import { blackboard } from "../../memory/blackboard.js";
import { eventBus } from "./event-bus.js";

/**
 * Taonix Consensus Manager (v23.0.0)
 * 負責分散式網路中事實的一致性判定與衝突仲裁。
 */
export class ConsensusManager {
  constructor() {
    this.revisions = new Map(); // 紀錄每個 Fact 的最新版本號
    this.init();
  }

  init() {
    console.log("[Consensus] 全球心智共識管理器已就緒。");
    
    // 監聽來自 P2P 的事實同步請求
    eventBus.subscribe("PEER_FACT_SYNC", (event) => {
      this.handlePeerSync(event.payload, event.metadata.source);
    });

    // v23.0.0 新增：專門監聽榮譽事實廣播
    eventBus.subscribe("PEER_HONOR_SYNC", (event) => {
      this.mergeAchievements(event.payload, event.metadata.source);
    });
  }

  /**
   * 合併全球集群榮譽
   */
  mergeAchievements(remoteAchievements, source) {
    const localFacts = blackboard.getFacts();
    const localAchievements = localFacts.team_achievements?.value || [];
    
    // 簡單合併：取聯集
    const newAchievementNames = new Set(localAchievements.map(a => a.name));
    let updated = false;

    remoteAchievements.forEach(ra => {
      if (!newAchievementNames.has(ra.name)) {
        localAchievements.push({ ...ra, source: `global-sync:${source}` });
        newAchievementNames.add(ra.name);
        updated = true;
      }
    });

    if (updated) {
      console.log(`[Consensus] 成功同步來自 ${source} 的全球榮譽紀錄。`);
      blackboard.updateFact("team_achievements", localAchievements, "consensus-manager");
    }
  }

  /**
   * 處理遠端事實同步
   */
  handlePeerSync(peerFact, source) {
    const { key, value, rev, timestamp } = peerFact;
    const localFact = blackboard.getFacts()[key];
    const currentRev = this.revisions.get(key) || (localFact?.metadata?.rev || 0);

    // 1. 版本衝突裁決 (Vector Clock 簡化版)
    if (rev > currentRev) {
      console.log(`[Consensus] 採納遠端更高版本事實: ${key} (v${rev} from ${source})`);
      this.revisions.set(key, rev);
      blackboard.updateFact(key, value, `p2p:${source}`, { rev, timestamp });
    } else if (rev === currentRev && timestamp > (localFact?.metadata?.timestamp || 0)) {
      // 同版本號，採納較新時間戳 (LWW)
      blackboard.updateFact(key, value, `p2p:${source}`, { rev, timestamp });
    } else {
      console.log(`[Consensus] 忽略過期遠端事實: ${key} (v${rev} <= v${currentRev})`);
    }
  }

  /**
   * 獲取包含版本資訊的事實包
   */
  getSyncPackage(key) {
    const fact = blackboard.getFacts()[key];
    if (!fact) return null;
    return {
      key,
      value: fact.value,
      rev: fact.metadata?.rev || 0,
      timestamp: fact.metadata?.timestamp || Date.now()
    };
  }
}

export const consensusManager = new ConsensusManager();
