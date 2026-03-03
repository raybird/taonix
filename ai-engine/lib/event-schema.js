/**
 * Taonix Event Schema (v23.0.0)
 * 定義系統內所有事件的標準 Payload 結構，確保通訊穩定性。
 */
export const Schemas = {
  TASK_STARTED: {
    required: ["taskId", "agent", "task", "timestamp"],
    types: { taskId: "string", agent: "string", task: "string", timestamp: "number" }
  },
  TASK_FINISHED: {
    required: ["taskId", "agent", "status", "summary"],
    types: { taskId: "string", agent: "string", status: "string", summary: "string" }
  },
  TASK_COMPLETED: {
    required: ["taskId"],
    types: { taskId: "string" }
  },
  TASK_ASSIGNED: {
    required: ["taskId", "agent"],
    types: { taskId: "string", agent: "string" }
  },
  TASK_RESUMED: {
    required: ["taskId"],
    types: { taskId: "string" }
  },
  TASK_ERROR: {
    required: ["taskId", "error"],
    types: { taskId: "string", error: "string" }
  },
  BLACKBOARD_UPDATED: {
    required: ["source", "timestamp"],
    types: { source: "string", timestamp: "number" }
  },
  FACT_DISCOVERED: {
    required: ["key"],
    types: { key: "string" }
  },
  PERFORMANCE_ALERT: {
    required: ["agent", "duration", "level", "suggestion", "timestamp"],
    types: { agent: "string", duration: "number", level: "string", suggestion: "string", timestamp: "number" }
  },
  SYSTEM_THROTTLING_STARTED: {
    required: ["reason", "target"],
    types: { reason: "string", target: "string" }
  },
  TASK_SUSPEND: {
    required: ["taskId", "reason"],
    types: { taskId: "string", reason: "string" }
  },
  AGENT_REGISTERED: {
    required: ["name"],
    types: { name: "string" }
  },
  PLAN_PROPOSED: {
    required: ["proposalId", "squadId"],
    types: { proposalId: "string", squadId: "string" }
  },
  PLAN_APPROVED: {
    required: ["proposalId"],
    types: { proposalId: "string" }
  },
  SQUAD_FORMED: {
    required: ["squadId"],
    types: { squadId: "string" }
  },
  EVOLUTION_RECORDED: {
    required: ["skillName", "action"],
    types: { skillName: "string", action: "string" }
  }
};

export function validateEvent(name, payload) {
  const schema = Schemas[name];
  if (!schema) {
    console.warn(`[Schema] 未定義 Schema 的事件: ${name}，跳過驗證。`);
    return true;
  }

  for (const field of schema.required) {
    if (payload[field] === undefined) {
      throw new Error(`[Schema] 事件 ${name} 缺少必要欄位: ${field}`);
    }
    if (typeof payload[field] !== schema.types[field]) {
      throw new Error(`[Schema] 事件 ${name} 欄位 ${field} 類型錯誤: 預期 ${schema.types[field]}`);
    }
  }
  return true;
}
