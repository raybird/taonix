#!/usr/bin/env node

import { Command } from "commander";
import { readFile, writeFile, listFiles } from "./lib/file-operations.js";
import { runCommand } from "./lib/shell-commands.js";
import { codeReview } from "./lib/code-review.js";

const program = new Command();

program
  .name("taonix-coder")
  .description("Taonix Coder Agent - 程式開發專家")
  .version("1.0.0");

program
  .command("read")
  .description("讀取檔案內容")
  .argument("<filepath>", "檔案路徑")
  .action(async (filepath) => {
    try {
      const content = await readFile(filepath);
      console.log(
        JSON.stringify({ success: true, data: { filepath, content } }, null, 2),
      );
    } catch (error) {
      console.error(JSON.stringify({ success: false, error: error.message }));
      process.exit(1);
    }
  });

program
  .command("write")
  .description("寫入檔案")
  .argument("<filepath>", "檔案路徑")
  .argument("<content>", "檔案內容")
  .action(async (filepath, content) => {
    try {
      await writeFile(filepath, content);
      console.log(
        JSON.stringify({ success: true, message: `File written: ${filepath}` }),
      );
    } catch (error) {
      console.error(JSON.stringify({ success: false, error: error.message }));
      process.exit(1);
    }
  });

program
  .command("ls")
  .description("列出目錄檔案")
  .argument("[directory]", "目錄路徑", ".")
  .action(async (directory) => {
    try {
      const files = await listFiles(directory);
      console.log(JSON.stringify({ success: true, data: files }, null, 2));
    } catch (error) {
      console.error(JSON.stringify({ success: false, error: error.message }));
      process.exit(1);
    }
  });

program
  .command("run")
  .description("執行指令")
  .argument("<command>", "要執行的指令")
  .option("-w, --workdir <dir>", "工作目錄")
  .action(async (command, options) => {
    try {
      const result = await runCommand(command, options.workdir);
      console.log(JSON.stringify({ success: true, data: result }, null, 2));
    } catch (error) {
      console.error(JSON.stringify({ success: false, error: error.message }));
      process.exit(1);
    }
  });

program
  .command("review")
  .description("Code Review - 檢視程式碼")
  .argument("<filepath>", "檔案路徑")
  .action(async (filepath) => {
    try {
      const result = await codeReview(filepath);
      console.log(JSON.stringify({ success: true, data: result }, null, 2));
    } catch (error) {
      console.error(JSON.stringify({ success: false, error: error.message }));
      process.exit(1);
    }
  });

program.parse();
