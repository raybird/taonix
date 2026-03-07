import test from "node:test";
import assert from "node:assert/strict";
import { PluginRegistry } from "../../src/core/plugins/registry.js";
import { Dispatcher } from "../../src/core/runtime/dispatcher.js";
import { Executor } from "../../src/core/runtime/executor.js";
import { Telemetry } from "../../src/core/telemetry/index.js";

test("dispatcher prefers in-process execution", async () => {
  const registry = new PluginRegistry();
  registry.registerCapability({
    name: "demo",
    handler: async (taskSpec) => ({ echoed: taskSpec.args.value }),
  });
  const telemetry = new Telemetry();
  const dispatcher = new Dispatcher(registry, new Executor(), telemetry);
  const result = await dispatcher.dispatch({
    id: "task_1",
    traceId: "trace_1",
    capability: "demo",
    args: { value: 42 },
    executionMode: "in_process",
  });

  assert.equal(result.success, true);
  assert.equal(result.data.echoed, 42);
});
