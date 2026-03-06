export function buildResultSpec(taskSpec, execution) {
  return {
    taskId: taskSpec.id,
    traceId: taskSpec.traceId,
    success: execution.success,
    status: execution.success ? "completed" : "failed",
    capability: taskSpec.capability,
    agent: taskSpec.targetAgent,
    data: execution.data ?? null,
    error: execution.error ?? null,
    meta: execution.meta || {},
  };
}
