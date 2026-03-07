const DEFAULT_EXECUTION_MODE = "in_process";

export function createTaskSpec(input = {}) {
  const now = new Date().toISOString();
  const task = {
    id: input.id || `task_${Date.now()}`,
    traceId: input.traceId || `trace_${Date.now()}`,
    capability: input.capability || "analyze_structure",
    input: input.input || "",
    args: input.args || {},
    target: input.target || null,
    executionMode: input.executionMode || DEFAULT_EXECUTION_MODE,
    status: input.status || "pending",
    meta: input.meta || {},
  };

  return {
    ...task,
    createdAt: input.createdAt || now,
  };
}

export function normalizeTaskInput(rawInput, options = {}) {
  if (typeof rawInput === "string") {
    return createTaskSpec({
      input: rawInput,
      target: options.target || process.cwd(),
      meta: {
        source: "natural_language",
        ...options.meta,
      },
    });
  }

  return createTaskSpec({
    ...rawInput,
    target: rawInput?.target || options.target || process.cwd(),
    meta: {
      source: "task_spec",
      ...rawInput?.meta,
      ...options.meta,
    },
  });
}

export function isTaskSpec(value) {
  return Boolean(
    value &&
      typeof value === "object" &&
      typeof value.id === "string" &&
      typeof value.traceId === "string" &&
      typeof value.capability === "string" &&
      "args" in value,
  );
}
