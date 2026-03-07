export function createCapabilitySpec(spec = {}) {
  return {
    name: spec.name,
    description: spec.description || "",
    inputSchema: spec.inputSchema || { type: "object", properties: {} },
    outputSchema: spec.outputSchema || { type: "object", properties: {} },
    executionMode: spec.executionMode || "in_process",
    sideEffects: spec.sideEffects || [],
    handler: spec.handler || null,
    fallback: spec.fallback || null,
    keywords: spec.keywords || [],
  };
}
