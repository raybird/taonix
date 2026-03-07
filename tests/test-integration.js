import assert from "node:assert/strict";
import { run, runTask } from "../src/core/runtime/index.js";
import { parseChildResult } from "../src/core/runtime/child-protocol.js";

async function runIntegrationTest() {
  console.log("=== Taonix Runtime Integration Smoke ===");

  const structure = await run("請分析這個專案的架構");
  assert.equal(structure.task.capability, "analyze_structure");
  assert.equal(structure.result.success, true);
  console.log("  ✓ natural language -> analyze_structure");

  const quality = await runTask({
    id: "task_quality",
    traceId: "trace_quality",
    capability: "check_quality",
    args: { filepath: "README.md" },
  });
  assert.equal(quality.result.success, true);
  console.log("  ✓ structured task -> check_quality");

  const cliProtocol = parseChildResult(
    '__TAONIX_RESULT__{"success":true,"data":{"mode":"legacy-smoke"}}\n',
  );

  assert.equal(cliProtocol.result.success, true);
  console.log("  ✓ legacy child protocol sentinel still parses");

  console.log("\nRuntime smoke passed.");
}

runIntegrationTest().catch((error) => {
  console.error(error);
  process.exit(1);
});
