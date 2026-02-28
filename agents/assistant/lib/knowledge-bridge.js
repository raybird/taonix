import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CACHE_PATH = path.resolve(__dirname, "..", "..", ".data", "knowledge_bridge.json");

export class KnowledgeBridge {
  constructor() {
    this.cache = new Map();
    this.load();
  }

  load() {
    try {
      if (fs.existsSync(CACHE_PATH)) {
        const data = JSON.parse(fs.readFileSync(CACHE_PATH, "utf-8"));
        Object.entries(data).forEach(([key, value]) => this.cache.set(key, value));
      }
    } catch (e) {
      console.warn("[KnowledgeBridge] 無法載入緩存:", e.message);
    }
  }

  save() {
    try {
      const data = Object.fromEntries(this.cache);
      fs.writeFileSync(CACHE_PATH, JSON.stringify(data, null, 2));
    } catch (e) {
      console.warn("[KnowledgeBridge] 無法儲存緩存:", e.message);
    }
  }

  /**
   * 共享知識到橋接器
   * @param {string} sourceAgent 來源 Agent (如: explorer)
   * @param {string} key 知識鍵值 (如: search_results:taonix)
   * @param {any} value 知識內容
   */
  share(sourceAgent, key, value) {
    const entry = {
      agent: sourceAgent,
      data: value,
      timestamp: new Date().toISOString()
    };
    this.cache.set(key, entry);
    this.save();
    console.log(`[KnowledgeBridge] ${sourceAgent} 已共享知識: ${key}`);
  }

  /**
   * 獲取共享知識
   * @param {string} key 知識鍵值
   * @returns {any} 知識內容
   */
  get(key) {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    // 檢查是否過期 (預設 1 小時)
    const age = Date.now() - new Date(entry.timestamp).getTime();
    if (age > 3600000) {
      this.cache.delete(key);
      this.save();
      return null;
    }
    
    return entry.data;
  }

  list() {
    return Array.from(this.cache.keys());
  }
}

export const knowledgeBridge = new KnowledgeBridge();
