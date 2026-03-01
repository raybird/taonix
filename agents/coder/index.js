#!/usr/bin/env node

import { Command } from "commander";
import { readFile, writeFile, listFiles } from "./lib/file-operations.js";
import { runCommand } from "./lib/shell-commands.js";
import { codeReview } from "./lib/code-review.js";
import { BaseAgent } from "../lib/base-agent.js";

const program = new Command();
const coder = new BaseAgent("coder");

program
  .name("taonix-coder")
  .description("Taonix Coder Agent (Hardened) - 具備黑板意識的開發專家")
  .version("14.1.0");

program
  .command("read")
  .description("讀取檔案並同步背景至黑板")
  .argument("<filepath>", "檔案路徑")
  .action(async (filepath) => {
    await coder.runTask(`讀取檔案: ${filepath}`, async (context) => {
      const content = await readFile(filepath);
      return { type: "file_content", filepath, size: content.length };
    });
  });

program
  .command("write")
  .description("寫入檔案並記錄變更事實")
  .argument("<filepath>", "檔案路徑")
  .argument("<content>", "檔案內容")
  .action(async (filepath, content) => {
    await coder.runTask(`寫入檔案: ${filepath}`, async (context) => {
      await writeFile(filepath, content);
      return { type: "file_change", filepath, action: "write", timestamp: Date.now() };
    });
  });

program
  .command("run")
  .description("執行指令並回報黑板結果")
  .argument("<command>", "指令")
  .option("-w, --workdir <dir>", "工作目錄")
  .action(async (command, options) => {
    await coder.runTask(`執行指令: ${command}`, async (context) => {
      const result = await runCommand(command, options.workdir);
      return { type: "command_execution", command, success: result.success, output_preview: result.output?.substring(0, 100) };
    });
  });

program.parse();
