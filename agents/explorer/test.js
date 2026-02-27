import { test, describe } from "node:test";
import assert from "node:assert";
import { getGithubTrending } from "./lib/github-trending.js";
import { searchWeb } from "./lib/web-search.js";

describe("Explorer Agent", () => {
  test("getGithubTrending returns array", async () => {
    const repos = await getGithubTrending("javascript");
    assert.ok(Array.isArray(repos), "Should return an array");
    assert.ok(repos.length > 0, "Should have at least one repo");
  });

  test("getGithubTrending has required fields", async () => {
    const repos = await getGithubTrending("javascript");
    const repo = repos[0];
    assert.ok(repo.name, "Should have name");
    assert.ok(repo.stars >= 0, "Should have stars");
    assert.ok(repo.url, "Should have url");
  });

  test("getGithubTrending works without language filter", async () => {
    const repos = await getGithubTrending();
    assert.ok(Array.isArray(repos), "Should return an array without language");
  });
});

describe("Web Search", () => {
  test("searchWeb returns array", async () => {
    const results = await searchWeb("test query", 3);
    assert.ok(Array.isArray(results), "Should return an array");
  });

  test("searchWeb respects limit", async () => {
    const results = await searchWeb("test", 2);
    assert.ok(results.length <= 2, "Should respect limit");
  });
});
