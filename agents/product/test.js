import { test, describe } from "node:test";
import assert from "node:assert";
import { generatePRD } from "./lib/prd-generator.js";
import { createUserStory } from "./lib/user-story.js";
import { analyzeFeature } from "./lib/feature-analyzer.js";

describe("Product Agent - PRD Generator", () => {
  test("generatePRD returns valid structure for web", async () => {
    const result = await generatePRD("My Web App", "web");
    assert.ok(result.title === "My Web App", "Should have correct title");
    assert.ok(result.type === "web", "Should have correct type");
    assert.ok(Array.isArray(result.template), "Should have template sections");
    assert.ok(result.content, "Should have content");
    assert.ok(result.content.features, "Should have features");
  });

  test("generatePRD returns valid structure for app", async () => {
    const result = await generatePRD("My Mobile App", "app");
    assert.ok(result.type === "app", "Should have app type");
    assert.ok(result.content.features.length > 0, "Should have app features");
  });

  test("generatePRD returns valid structure for api", async () => {
    const result = await generatePRD("My API", "api");
    assert.ok(result.type === "api", "Should have api type");
    assert.ok(result.content.features, "Should have api features");
  });

  test("generatePRD defaults to web for unknown type", async () => {
    const result = await generatePRD("Test", "unknown");
    assert.ok(result.type === "unknown", "Should preserve type");
    assert.ok(result.content.features, "Should still have features");
  });

  test("generatePRD includes success metrics", async () => {
    const result = await generatePRD("Test", "web");
    assert.ok(
      Array.isArray(result.content.successMetrics),
      "Should have success metrics",
    );
    assert.ok(
      result.content.successMetrics.length > 0,
      "Should have metrics data",
    );
  });
});

describe("Product Agent - User Story", () => {
  test("createUserStory returns valid structure", async () => {
    const result = await createUserStory("開發者", "建立新功能", "加速開發");
    assert.ok(result.asA === "開發者", "Should have role");
    assert.ok(result.iWantTo === "建立新功能", "Should have action");
    assert.ok(result.soThat === "加速開發", "Should have benefit");
  });

  test("createUserStory generates acceptance criteria", async () => {
    const result = await createUserStory("開發者", "建立新功能", "加速開發");
    assert.ok(Array.isArray(result.acceptanceCriteria), "Should have AC");
    assert.ok(result.acceptanceCriteria.length > 0, "Should have AC items");
  });

  test("createUserStory estimates story points", async () => {
    const result = await createUserStory("開發者", "建立複雜功能", "加速開發");
    assert.ok(result.storyPoints, "Should have story points");
  });

  test("createUserStory determines priority", async () => {
    const result = await createUserStory("開發者", "登入功能", "驗證身份");
    assert.ok(result.priority, "Should have priority");
  });

  test("createUserStory generates tasks", async () => {
    const result = await createUserStory("開發者", "建立功能", "測試");
    assert.ok(Array.isArray(result.tasks), "Should have tasks");
  });
});

describe("Product Agent - Feature Analyzer", () => {
  test("analyzeFeature returns valid structure", async () => {
    const result = await analyzeFeature("用戶登入", { complexity: "high" });
    assert.ok(result.name, "Should have name");
    assert.ok(result.analysis, "Should have analysis");
  });

  test("analyzeFeature handles different complexity levels", async () => {
    const highResult = await analyzeFeature("Complex", { complexity: "high" });
    const lowResult = await analyzeFeature("Simple", { complexity: "low" });
    assert.ok(highResult.analysis, "Should analyze high complexity");
    assert.ok(lowResult.analysis, "Should analyze low complexity");
  });
});
