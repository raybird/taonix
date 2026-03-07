import test from "node:test";
import assert from "node:assert/strict";
import { createTaskSpec, isTaskSpec } from "../../src/core/contracts/task-spec.js";
import { createResultSpec } from "../../src/core/contracts/result-spec.js";

test("task spec is stable and serializable", () => {
  const task = createTaskSpec({
    id: "task_1",
    traceId: "trace_1",
    capability: "analyze_structure",
    args: { directory: "." },
  });

  assert.equal(isTaskSpec(task), true);
  assert.equal(JSON.parse(JSON.stringify(task)).capability, "analyze_structure");
});

test("result spec keeps contract fields", () => {
  const result = createResultSpec(
    { id: "task_1", traceId: "trace_1", capability: "check_quality", executionMode: "in_process" },
    { success: false, error: { message: "boom", code: "X" } },
  );

  assert.equal(result.status, "failed");
  assert.equal(result.error.code, "X");
});
