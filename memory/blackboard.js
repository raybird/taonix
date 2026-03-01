import fs from "fs";
import path from "path";
import { eventBus } from "../ai-engine/lib/event-bus.js";

/**
 * Taonix Blackboard (v4.2.0)
 * 全域狀態與推理鏈路中樞。
 * 不同於普通的 Cache，黑板模式允許 Agent 留下「思考痕跡」。
 */
export import { paths } from "../config/paths.js";

class Blackboard {
  constructor() {
    this.stateFile = paths.blackboard;
    this.memory = {
      facts: {},        // 確定的事實
      thoughts: [],     // 推理過程
      hypotheses: [],   // 待驗證的假設
      activeTask: null  // 當前全域任務
    };
    this.load();
  }

  load() {
    try {
      if (fs.existsSync(this.stateFile)) {
        this.memory = JSON.parse(fs.readFileSync(this.stateFile, "utf-8"));
      }
    } catch (e) {
      console.warn("[Blackboard] 無法載入狀態:", e.message);
    }
  }

  save() {
    try {
      const dir = path.dirname(this.stateFile);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(this.stateFile, JSON.stringify(this.memory, null, 2));
      
      // 同步發布狀態更新事件
      eventBus.publish("BLACKBOARD_UPDATED", { summary: "State snapshot saved" }, "blackboard");
    } catch (e) {
      console.warn("[Blackboard] 無法儲存狀態:", e.message);
    }
  }

  /**
   * 記錄推理
   * @param {string} agent 來源 Agent
   * @param {string} content 思考內容
   */
  recordThought(agent, content) {
    const entry = {
      timestamp: new Date().toISOString(),
      agent,
      content
    };
    this.memory.thoughts.push(entry);
    this.save();
    console.log(`[Blackboard] ${agent} 紀錄了新思考。`);
  }

  /**
   * 更新事實
   */
  updateFact(key, value, source) {
    this.memory.facts[key] = {
      value,
      source,
      updated: new Date().toISOString()
    };
    this.save();
    eventBus.publish("FACT_DISCOVERED", { key, value }, source);
  }

  getFacts() {
    return this.memory.facts;
  }

  /**
   * 搜尋相關推理 (模擬向量檢索)
   * @param {string} query 搜尋關鍵字或意圖
   */
  findRelevantThoughts(query, limit = 3) {
    const keywords = query.toLowerCase().match(/[\u4e00-\u9fa5]{2,}|[a-z]{3,}/g) || [];
    if (keywords.length === 0) return this.getRecentThoughts(limit);

    return this.memory.thoughts
      .map(t => {
        let score = 0;
        const content = t.content.toLowerCase();
        keywords.forEach(k => { if (content.includes(k)) score++; });
        return { ...t, score };
      })
      .filter(t => t.score > 0)
      .sort((a, b) => b.score - a.score || new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
  }

  /**
   * 獲取用於注入 Context 的摘要
   */
  getSummaryForContext() {
    const factSummary = Object.entries(this.memory.facts)
      .map(([k, v]) => `- [事實] ${k}: ${JSON.stringify(v.value)} (來源: ${v.source})`)
      .join("\n");
    
    const thoughtSummary = this.memory.thoughts.slice(-5)
      .map(t => `- [推理] ${t.agent}: ${t.content}`)
      .join("\n");

    return `【黑板共享資訊】\n現有事實：\n${factSummary || "無"}\n\n最近推理：\n${thoughtSummary || "無"}`;
  }

  getRecentThoughts(limit = 5) {
    return this.memory.thoughts.slice(-limit);
  }
}

export const blackboard = new Blackboard();
