export function createEventSpec(event = {}) {
  return {
    type: event.type || "runtime.event",
    timestamp: event.timestamp || new Date().toISOString(),
    taskId: event.taskId || null,
    traceId: event.traceId || null,
    capability: event.capability || null,
    status: event.status || "info",
    payload: event.payload || {},
  };
}
