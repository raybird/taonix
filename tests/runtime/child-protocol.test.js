import test from "node:test";
import assert from "node:assert/strict";
import { parseChildResult } from "../../src/core/runtime/child-protocol.js";

test("child protocol parses current sentinel", () => {
  const parsed = parseChildResult('__TAONIX_CHILD_RESULT__{"success":true,"data":{"ok":1}}\n');
  assert.equal(parsed.protocol, "current");
  assert.equal(parsed.result.data.ok, 1);
});

test("child protocol parses legacy sentinel", () => {
  const parsed = parseChildResult('__TAONIX_RESULT__{"success":true,"data":{"ok":1}}\n');
  assert.equal(parsed.protocol, "legacy");
  assert.equal(parsed.result.success, true);
});
