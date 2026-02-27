import { test, describe } from "node:test";
import assert from "node:assert";
import { generateUI } from "./lib/ui-generator.js";
import { generateComponent } from "./lib/component-generator.js";
import { analyzeUX } from "./lib/ux-analyzer.js";

describe("Designer Agent - UI Generator", () => {
  test("generateUI returns valid structure for desktop", async () => {
    const result = await generateUI("desktop");
    assert.ok(result.type === "desktop", "Should have correct type");
    assert.ok(result.layout, "Should have layout");
    assert.ok(result.colors, "Should have colors");
    assert.ok(
      Array.isArray(result.recommendations),
      "Should have recommendations",
    );
  });

  test("generateUI returns valid structure for mobile", async () => {
    const result = await generateUI("mobile");
    assert.ok(result.type === "mobile", "Should have correct type");
    assert.ok(result.layout, "Should have layout");
  });

  test("generateUI returns valid structure for dashboard", async () => {
    const result = await generateUI("dashboard");
    assert.ok(result.type === "dashboard", "Should have correct type");
  });

  test("generateUI uses default for unknown type", async () => {
    const result = await generateUI("unknown");
    assert.ok(result.type === "unknown", "Should preserve type");
    assert.ok(result.colors.primary, "Should still have colors");
  });

  test("generateUI supports dark color palette", async () => {
    const result = await generateUI("desktop", "dark");
    assert.ok(
      result.colors.background === "#0F172A",
      "Should use dark palette",
    );
  });

  test("generateUI supports warm color palette", async () => {
    const result = await generateUI("desktop", "warm");
    assert.ok(result.colors.primary === "#F59E0B", "Should use warm palette");
  });
});

describe("Designer Agent - Component Generator", () => {
  test("generateComponent returns valid structure", async () => {
    const result = await generateComponent("button", { variant: "primary" });
    assert.ok(result.name, "Should have component name");
    assert.ok(result.props, "Should have props");
  });

  test("generateComponent handles different types", async () => {
    const buttonResult = await generateComponent("button");
    assert.ok(buttonResult.name, "Should generate button");

    const cardResult = await generateComponent("card");
    assert.ok(cardResult.name, "Should generate card");

    const inputResult = await generateComponent("input");
    assert.ok(inputResult.name, "Should generate input");
  });
});

describe("Designer Agent - UX Analyzer", () => {
  test("analyzeUX returns error for non-existent directory", async () => {
    const result = await analyzeUX("/non/existent/path");
    assert.ok(result.error, "Should return error for invalid path");
  });

  test("analyzeUX returns valid structure for empty analysis", async () => {
    const result = await analyzeUX("/tmp");
    assert.ok(result.navigation, "Should have navigation analysis");
    assert.ok(result.interaction, "Should have interaction analysis");
    assert.ok(result.accessibility, "Should have accessibility analysis");
    assert.ok(result.performance, "Should have performance analysis");
  });
});
