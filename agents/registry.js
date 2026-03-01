import { paths } from "../config/paths.js";
import fs from "fs";
import path from "path";
import { eventBus } from "../ai-engine/lib/event-bus.js";

/**
 * Taonix Agent Registry (v5.0.0)
 * 負責 Agent 的服務註冊與發現，是自組織協作的基礎。
 */
export class AgentRegistry {
  constructor() {
    this.registryFile = require("../config/paths.js").paths.agent_registry.json;
    this.agents = new Map();
    this.load();
  }

  load() {
    try {
      if (fs.existsSync(this.registryFile)) {
        const data = JSON.parse(fs.readFileSync(this.registryFile, "utf-8"));
        Object.entries(data).forEach(([name, meta]) => this.agents.set(name, meta));
      }
    } catch (e) {
      console.warn("[AgentRegistry] 無法載入註冊表:", e.message);
    }
  }

  save() {
    try {
      const data = Object.fromEntries(this.agents);
      fs.writeFileSync(this.registryFile, JSON.stringify(data, null, 2));
    } catch (e) {
      console.warn("[AgentRegistry] 無法儲存註冊表:", e.message);
    }
  }

  /**
   * 註冊 Agent
   * @param {string} name Agent 名稱
   * @param {object} metadata 包含能力 (capabilities)、狀態等
   */
  register(name, metadata) {
    const entry = {
      ...metadata,
      lastSeen: new Date().toISOString(),
      status: "online"
    };
    this.agents.set(name, entry);
    this.save();
    console.log(`[AgentRegistry] Agent 「${name}」 已註冊/更新。`);
    eventBus.publish("AGENT_REGISTERED", { name, capabilities: metadata.capabilities }, "registry");
  }

  /**
   * 發現具備特定能力的 Agent
   * @param {string} capability 能力名稱 (如: "coding", "searching")
   */
  findAgentsByCapability(capability) {
    return Array.from(this.agents.entries())
      .filter(([_, meta]) => meta.capabilities && meta.capabilities.includes(capability))
      .map(([name, meta]) => ({ name, ...meta }));
  }

  getOnlineAgents() {
    return Array.from(this.agents.entries())
      .map(([name, meta]) => ({ name, ...meta }));
  }
}

export const agentRegistry = new AgentRegistry();
