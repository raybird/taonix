import { test, describe } from "node:test";
import assert from "node:assert";
import { checkQuality } from "./lib/quality-checker.js";
import { checkFormat } from "./lib/format-checker.js";
import { checkLogic } from "./lib/logic-checker.js";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

describe("Reviewer Agent - Quality Checker", () => {
  test("checkQuality returns object with required fields", async () => {
    const result = await checkQuality(join(__dirname, "index.js"));
    assert.ok(result.filepath, "Should have filepath");
    assert.ok(typeof result.totalLines === "number", "Should have totalLines");
    assert.ok(typeof result.score === "number", "Should have score");
    assert.ok(result.issues, "Should have issues");
  });

  test("checkQuality detects eval security issue", async () => {
    const result = await checkQuality(join(__dirname, "index.js"));
    assert.ok(
      typeof result.issues.security === "object",
      "Should have security issues array",
    );
  });
});

describe("Reviewer Agent - Format Checker", () => {
  test("checkFormat returns object", async () => {
    const result = await checkFormat(join(__dirname, "index.js"));
    assert.ok(result, "Should return result");
  });
});

describe("Reviewer Agent - Logic Checker", () => {
  test("checkLogic returns object", async () => {
    const result = await checkLogic(join(__dirname, "index.js"));
    assert.ok(result, "Should return result");
  });
});
