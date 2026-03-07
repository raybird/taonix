import test from "node:test";
import assert from "node:assert/strict";
import analyzeStructure from "../../src/capabilities/analyze-structure/index.js";
import checkQuality from "../../src/capabilities/check-quality/index.js";
import webSearch from "../../src/capabilities/web-search/index.js";
import githubTrending from "../../src/capabilities/github-trending/index.js";

test("analyze_structure capability works in process", async () => {
  const result = await analyzeStructure.handler({ args: { directory: "." }, target: "." });
  assert.equal(typeof result.fileCount, "number");
});

test("check_quality capability reads file", async () => {
  const result = await checkQuality.handler({ args: { filepath: "package.json" } });
  assert.equal(result.filepath, "package.json");
});

test("web_search capability is mock-friendly", async () => {
  const result = await webSearch.handler({ args: { query: "taonix" }, input: "taonix" });
  assert.equal(Array.isArray(result), true);
});

test("github_trending capability can run with injected context", async () => {
  const result = await githubTrending.handler(
    { args: { language: "javascript" } },
    { githubTrending: async (language) => [{ language, full_name: "demo/repo" }] },
  );
  assert.equal(result[0].language, "javascript");
});
