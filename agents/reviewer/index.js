#!/usr/bin/env node

import { Command } from "commander";
import { checkQuality } from "./lib/quality-checker.js";
import { checkFormat } from "./lib/format-checker.js";
import { checkLogic } from "./lib/logic-checker.js";

const program = new Command();

program
  .name("taonix-reviewer")
  .description("Taonix Reviewer Agent - 品質把關專家")
  .version("1.0.0");

program
  .command("quality")
  .description("檢查程式碼品質")
  .argument("<filepath>", "檔案路徑")
  .action(async (filepath) => {
    try {
      const result = await checkQuality(filepath);
      console.log(JSON.stringify({ success: true, data: result }, null, 2));
    } catch (error) {
      console.error(JSON.stringify({ success: false, error: error.message }));
      process.exit(1);
    }
  });

program
  .command("format")
  .description("檢查程式碼格式")
  .argument("<filepath>", "檔案路徑")
  .action(async (filepath) => {
    try {
      const result = await checkFormat(filepath);
      console.log(JSON.stringify({ success: true, data: result }, null, 2));
    } catch (error) {
      console.error(JSON.stringify({ success: false, error: error.message }));
      process.exit(1);
    }
  });

program
  .command("logic")
  .description("檢查邏輯一致性")
  .argument("<filepath>", "檔案路徑")
  .action(async (filepath) => {
    try {
      const result = await checkLogic(filepath);
      console.log(JSON.stringify({ success: true, data: result }, null, 2));
    } catch (error) {
      console.error(JSON.stringify({ success: false, error: error.message }));
      process.exit(1);
    }
  });

program.parse();
