import { preferenceStore } from "./preference-store.js";
import { taskHistory } from "./task-history.js";

let mcpMemoryCreateEntities = null;
try {
  const mcpModule = await import("../tools/mcp-memory.js");
  mcpMemoryCreateEntities = mcpModule.mcp_memory_libsql_create_entities;
} catch (e) {
  console.warn("[Learning] MCP Memory 模組不可用，使用本地儲存");
}

export class LearningModule {
  constructor() {
    this.store = preferenceStore;
  }

  async learn(context) {
    const { input, skill, agents, result, duration } = context;

    this.store.record(
      skill,
      agents?.map((a) => a.agent),
    );

    taskHistory.addTask({
      input,
      skill,
      agents: agents?.map((a) => a.agent) || [],
      status: "completed",
      duration,
      result: result?.substring(0, 200),
    });

    if (skill && result) {
      await this.saveToMemory(context);
    }
  }

  async saveToMemory(context) {
    if (!mcpMemoryCreateEntities) return;

    try {
      const { input, skill, agents } = context;
      const agentNames = agents?.map((a) => a.agent).join(", ") || "unknown";

      await mcpMemoryCreateEntities({
        entities: [
          {
            entityType: "TaonixSession",
            name: `session_${Date.now()}`,
            observations: [
              `User input: ${input.substring(0, 100)}`,
              `Triggered skill: ${skill}`,
              `Used agents: ${agentNames}`,
              `Timestamp: ${new Date().toISOString()}`,
            ],
          },
        ],
      });
    } catch (e) {
      console.warn("[Learning] 無法儲存到 MCP Memory:", e.message);
    }
  }

  getPreferences() {
    return {
      stats: this.store.getStats(),
      favoriteLanguage: this.store.get("language"),
      favoriteFramework: this.store.get("framework"),
    };
  }

  setPreference(key, value) {
    this.store.set(key, value);
  }

  async suggest(context) {
    const stats = this.store.getStats();
    const { input } = context;
    const text = (input || "").toLowerCase();

    const suggestions = [];

    if (stats.topSkills.length > 0) {
      suggestions.push({
        type: "skill",
        message: `您常用技能: ${stats.topSkills[0].skill}`,
      });
    }

    if (stats.topAgents.length > 0) {
      suggestions.push({
        type: "agent",
        message: `常用 Agent: ${stats.topAgents[0].agent}`,
      });
    }

    return suggestions;
  }
}

export const learning = new LearningModule();
export { taskHistory };
export default learning;
