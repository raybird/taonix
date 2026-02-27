import { test, describe } from "node:test";
import assert from "node:assert";
import { analyzeStructure } from "./lib/structure-analyzer.js";
import { analyzeDependencies } from "./lib/dependency-analyzer.js";
import { suggestArchitecture } from "./lib/architecture-suggestion.js";

describe("Oracle Agent - Structure Analyzer", () => {
  test("analyzeStructure returns object with required fields", async () => {
    const result = await analyzeStructure(".");
    assert.ok(result.directory, "Should have directory");
    assert.ok(typeof result.fileCount === "number", "Should have fileCount");
    assert.ok(typeof result.dirCount === "number", "Should have dirCount");
    assert.ok(result.tree, "Should have tree");
  });

  test("analyzeStructure excludes node_modules", async () => {
    const result = await analyzeStructure(".");
    assert.ok(!result.tree.node_modules, "Should exclude node_modules");
  });

  test("analyzeStructure excludes hidden files", async () => {
    const result = await analyzeStructure(".");
    const allFiles = Object.keys(result.tree);
    const hiddenFiles = allFiles.filter((f) => f.startsWith("."));
    assert.strictEqual(hiddenFiles.length, 0, "Should exclude hidden files");
  });
});

describe("Oracle Agent - Dependency Analyzer", () => {
  test("analyzeDependencies returns object", async () => {
    const result = await analyzeDependencies(".");
    assert.ok(result, "Should return result");
  });
});

describe("Oracle Agent - Architecture Suggestion", () => {
  test("suggestArchitecture returns object", async () => {
    const result = await suggestArchitecture(".");
    assert.ok(result, "Should return result");
  });
});
