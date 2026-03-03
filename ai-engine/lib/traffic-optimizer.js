import crypto from "crypto";

/**
 * Taonix Traffic Optimizer (v23.0.0)
 * 負責 P2P 心智同步的頻寬壓縮與指紋校驗。
 */
export class TrafficOptimizer {
  constructor() {
    this.factHashes = new Map();
  }

  /**
   * 判斷事實是否發生實質異動
   */
  shouldBroadcast(key, value) {
    const newHash = this._calculateHash(value);
    const oldHash = this.factHashes.get(key);

    if (newHash !== oldHash) {
      this.factHashes.set(key, newHash);
      return true;
    }
    return false;
  }

  /**
   * 壓縮事實包 (僅保留核心數據與指紋)
   */
  compressPackage(payload) {
    // 實作層：可在此加入 zlib 壓縮或移除不必要的 metadata
    return {
      ...payload,
      _sig: this._calculateHash(payload.value).substring(0, 8)
    };
  }

  _calculateHash(value) {
    return crypto.createHash("md5").update(JSON.stringify(value)).digest("hex");
  }
}

export const trafficOptimizer = new TrafficOptimizer();
