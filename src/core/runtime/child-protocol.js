export const CHILD_PROTOCOL_VERSION = 1;
export const CHILD_RESULT_SENTINEL = "__TAONIX_CHILD_RESULT__";
export const LEGACY_CHILD_RESULT_SENTINEL = "__TAONIX_RESULT__";

export function createChildPayload(taskSpec, policy = {}) {
  return {
    version: CHILD_PROTOCOL_VERSION,
    task: {
      id: taskSpec.id,
      traceId: taskSpec.traceId,
      capability: taskSpec.capability,
      input: taskSpec.input,
      args: taskSpec.args,
      target: taskSpec.target,
    },
    policy: {
      timeoutMs: policy.timeoutMs || 30_000,
      retryCount: policy.retryCount || 0,
    },
  };
}

export function emitChildResult(result, options = {}) {
  const sentinel = options.legacy ? LEGACY_CHILD_RESULT_SENTINEL : CHILD_RESULT_SENTINEL;
  process.stdout.write(`${sentinel}${JSON.stringify(result)}\n`);
}

export function parseChildResult(stdout = "") {
  const lines = stdout.split("\n");
  for (let index = lines.length - 1; index >= 0; index -= 1) {
    const line = lines[index];
    const sentinel = [CHILD_RESULT_SENTINEL, LEGACY_CHILD_RESULT_SENTINEL].find((entry) => line.includes(entry));
    if (!sentinel) continue;

    try {
      return {
        protocol: sentinel === CHILD_RESULT_SENTINEL ? "current" : "legacy",
        result: JSON.parse(line.slice(line.indexOf(sentinel) + sentinel.length)),
      };
    } catch (error) {
      return {
        protocol: sentinel === CHILD_RESULT_SENTINEL ? "current" : "legacy",
        error,
      };
    }
  }

  return null;
}
