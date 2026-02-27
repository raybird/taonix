import { test, describe } from "node:test";
import assert from "node:assert";
import { scheduleTask, listTasks } from "./lib/scheduler-helper.js";
import { searchMemory, saveToMemory } from "./lib/memory-helper.js";
import { analyzeRequest } from "./lib/analyzer.js";

describe("Assistant Agent - Scheduler Helper", () => {
  test("scheduleTask returns valid structure", async () => {
    const result = await scheduleTask("test-task", "*/30 * * * *");
    assert.ok(result.task === "test-task", "Should have task name");
    assert.ok(result.cron === "*/30 * * * *", "Should have cron");
    assert.ok(result.status === "pending", "Should have pending status");
  });

  test("listTasks returns valid structure", async () => {
    const result = await listTasks();
    assert.ok(Array.isArray(result.tasks), "Should have tasks array");
    assert.ok(typeof result.count === "number", "Should have count");
  });
});

describe("Assistant Agent - Memory Helper", () => {
  test("searchMemory returns valid structure", async () => {
    const result = await searchMemory("test query");
    assert.ok(result.query === "test query", "Should have query");
    assert.ok(Array.isArray(result.results), "Should have results");
  });

  test("saveToMemory returns valid structure", async () => {
    const result = await saveToMemory("key", "value");
    assert.ok(result.action === "saved", "Should have saved action");
    assert.ok(result.key === "key", "Should have key");
    assert.ok(result.value === "value", "Should have value");
  });
});

describe("Assistant Agent - Analyzer", () => {
  test("analyzeRequest detects schedule intent", async () => {
    const result = await analyzeRequest("幫我建立排程");
    assert.ok(result.intent === "schedule", "Should detect schedule intent");
  });

  test("analyzeRequest detects memory intent", async () => {
    const result = await analyzeRequest("搜尋記憶");
    assert.ok(result.intent === "memory", "Should detect memory intent");
  });

  test("analyzeRequest detects task intent", async () => {
    const result = await analyzeRequest("建立任務");
    assert.ok(result.intent === "task", "Should detect task intent");
  });

  test("analyzeRequest returns suggestions", async () => {
    const result = await analyzeRequest("排程");
    assert.ok(
      Array.isArray(result.suggestedActions),
      "Should have suggestions",
    );
  });
});
