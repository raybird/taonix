export function createResultSpec(taskSpec, result = {}) {
  return {
    taskId: taskSpec.id,
    traceId: taskSpec.traceId,
    capability: taskSpec.capability,
    executionMode: result.executionMode || taskSpec.executionMode,
    status: result.status || (result.success ? "completed" : "failed"),
    success: Boolean(result.success),
    data: result.data ?? null,
    error: result.error
      ? {
          message: result.error.message || result.error,
          code: result.error.code || "TASK_FAILED",
          details: result.error.details || null,
        }
      : null,
    meta: result.meta || {},
  };
}
