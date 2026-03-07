import test from "node:test";
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { createMcpHub } from "../../src/interfaces/mcp/index.js";

const execFileAsync = promisify(execFile);

test("CLI capabilities command works", async () => {
  const { stdout } = await execFileAsync("node", ["src/interfaces/cli/index.js", "capabilities"], {
    cwd: process.cwd(),
  });
  const parsed = JSON.parse(stdout);
  assert.equal(parsed.some((entry) => entry.name === "analyze_structure"), true);
});

test("MCP hub exposes single stable tool", async () => {
  const hub = await createMcpHub();
  assert.deepEqual(hub.tools.map((tool) => tool.name), ["taonix_hub"]);
  const result = await hub.callTool("taonix_hub", {
    task: {
      id: "task_cli",
      traceId: "trace_cli",
      capability: "check_quality",
      args: { filepath: "package.json" },
    },
  });
  assert.equal(result.result.success, true);
});
