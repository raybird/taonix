import test from "node:test";
import assert from "node:assert/strict";
import { PluginRegistry } from "../../src/core/plugins/registry.js";
import { Router } from "../../src/core/runtime/router.js";

function createRegistry() {
  const registry = new PluginRegistry();
  registry.registerCapability({ name: "analyze_structure", keywords: ["structure", "架構", "結構"] });
  registry.registerCapability({ name: "check_quality", keywords: ["quality", "品質"] });
  return registry;
}

test("router supports exact capability", async () => {
  const router = new Router(createRegistry());
  const routed = await router.route("check_quality");
  assert.equal(routed.taskSpec.capability, "check_quality");
  assert.equal(routed.route.method, "exact_capability");
});

test("router falls back deterministically", async () => {
  const router = new Router(createRegistry(), { defaultCapability: "analyze_structure" });
  const routed = await router.route("completely unrelated phrase");
  assert.equal(routed.taskSpec.capability, "analyze_structure");
  assert.equal(routed.route.method, "deterministic_fallback");
});
