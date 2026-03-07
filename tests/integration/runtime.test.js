import test from "node:test";
import assert from "node:assert/strict";
import { createRuntime } from "../../src/core/runtime/index.js";

test("runtime run normalizes intent and executes unified pipeline", async () => {
  const runtime = await createRuntime();
  const response = await runtime.run("請分析這個 repo 的結構");
  assert.equal(response.task.capability, "analyze_structure");
  assert.equal(response.result.success, true);
});

test("runtime runTask executes structured task spec", async () => {
  const runtime = await createRuntime();
  const response = await runtime.runTask({
    id: "task_check",
    traceId: "trace_check",
    capability: "check_quality",
    args: { filepath: "package.json" },
  });
  assert.equal(response.result.success, true);
});
