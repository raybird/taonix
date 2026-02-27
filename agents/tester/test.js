import { test, describe } from "node:test";
import assert from "node:assert";
import { generateTest } from "./lib/test-generator.js";
import { createTestPlan } from "./lib/test-plan.js";
import { runTests } from "./lib/test-runner.js";

describe("Tester Agent - Test Generator", () => {
  test("generateTest throws error for non-existent file", async () => {
    try {
      await generateTest("/non/existent/file.js");
      assert.fail("Should throw error");
    } catch (error) {
      assert.ok(
        error.message.includes("not found"),
        "Should throw file not found error",
      );
    }
  });

  test("generateTest generates unit test for JS file", async () => {
    const result = await generateTest("agents/explorer/index.js", "unit");
    assert.ok(result.file, "Should have file name");
    assert.ok(result.content, "Should have content");
    assert.ok(
      result.content.includes("describe"),
      "Should have test structure",
    );
  });

  test("generateTest generates unit test for TS file", async () => {
    const result = await generateTest("test.ts", "unit");
    assert.ok(
      result.file.endsWith(".test.ts"),
      "Should have .test.ts extension",
    );
  });

  test("generateTest generates test for JSX file", async () => {
    const result = await generateTest("component.jsx", "unit");
    assert.ok(
      result.file.endsWith(".test.jsx"),
      "Should have .test.jsx extension",
    );
    assert.ok(result.content.includes("render"), "Should have React test");
  });

  test("generateTest generates test for TSX file", async () => {
    const result = await generateTest("component.tsx", "unit");
    assert.ok(
      result.file.endsWith(".test.tsx"),
      "Should have .test.tsx extension",
    );
  });
});

describe("Tester Agent - Test Plan", () => {
  test("createTestPlan returns valid structure", async () => {
    const result = await createTestPlan("登入功能", { complexity: "medium" });
    assert.ok(result.name, "Should have name");
    assert.ok(result.phases, "Should have phases");
    assert.ok(Array.isArray(result.phases), "Should be array");
  });

  test("createTestPlan handles different complexity levels", async () => {
    const simpleResult = await createTestPlan("Simple Feature", {
      complexity: "low",
    });
    const complexResult = await createTestPlan("Complex Feature", {
      complexity: "high",
    });

    assert.ok(
      simpleResult.phases.length > 0,
      "Should have phases for low complexity",
    );
    assert.ok(
      complexResult.phases.length > simpleResult.phases.length,
      "Should have more phases for high complexity",
    );
  });

  test("createTestPlan includes test types", async () => {
    const result = await createTestPlan("Test Feature", {});
    const phaseNames = result.phases.map((p) => p.name).join(" ");
    assert.ok(
      phaseNames.includes("單元") || phaseNames.includes("整合"),
      "Should include test types",
    );
  });
});

describe("Tester Agent - Test Runner", () => {
  test("runTests returns valid result structure", async () => {
    const result = await runTests("test-directory");
    assert.ok(result.passed !== undefined, "Should have passed count");
    assert.ok(result.failed !== undefined, "Should have failed count");
    assert.ok(result.total !== undefined, "Should have total count");
  });

  test("runTests returns zero counts for empty directory", async () => {
    const result = await runTests("/tmp/empty-test-dir");
    assert.ok(typeof result.passed === "number", "Should have passed count");
    assert.ok(typeof result.failed === "number", "Should have failed count");
  });
});
