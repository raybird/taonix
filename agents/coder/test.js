import { test, describe } from "node:test";
import assert from "node:assert";
import { readFile, writeFile, listFiles } from "./lib/file-operations.js";
import { runCommand } from "./lib/shell-commands.js";
import { codeReview } from "./lib/code-review.js";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";

const __dirname = dirname(fileURLToPath(import.meta.url));

describe("File Operations", () => {
  test("readFile reads file content", async () => {
    const content = await readFile(join(__dirname, "package.json"));
    assert.ok(content.includes("name"), "Should contain package name");
  });

  test("writeFile creates new file", async () => {
    const tmpDir = mkdtempSync(join(tmpdir(), "taonix-test-"));
    const tmpFile = join(tmpDir, "test.txt");
    await writeFile(tmpFile, "Hello Taonix");
    const content = await readFile(tmpFile);
    assert.strictEqual(content, "Hello Taonix");
    rmSync(tmpDir, { recursive: true });
  });

  test("listFiles returns array", async () => {
    const files = await listFiles(__dirname);
    assert.ok(Array.isArray(files), "Should return array");
  });
});

describe("Shell Commands", () => {
  test("runCommand executes simple command", async () => {
    const result = await runCommand("echo hello");
    assert.ok(result.stdout.includes("hello"), "Should echo hello");
  });

  test("runCommand returns exitCode 0 for success", async () => {
    const result = await runCommand("true");
    assert.strictEqual(result.exitCode, 0);
  });
});

describe("Code Review", () => {
  test("codeReview analyzes JavaScript file", async () => {
    const result = await codeReview(join(__dirname, "index.js"));
    assert.ok(result, "Should return review result");
  });
});
