/**
 * Taonix Event Schema (v14.1.0)
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
  BLACKBOARD_UPDATED: {
    required: ["source", "timestamp"],
    types: { source: "string", timestamp: "number" }
  }
};

export function validateEvent(name, payload) {
  const schema = Schemas[name];
  if (!schema) return true; // 未定義 Schema 的事件暫不校驗

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
