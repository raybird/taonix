#!/usr/bin/env node

import { Command } from "commander";
import { checkQuality } from "./lib/quality-checker.js";
import { checkFormat } from "./lib/format-checker.js";
import { checkLogic } from "./lib/logic-checker.js";
import { BaseAgent } from "../lib/base-agent.js";

const program = new Command();
const reviewer = new BaseAgent("reviewer");

program
  .name("taonix-reviewer")
  .description("Taonix Reviewer Agent (Hardened) - 品質把關專家")
  .version("14.1.0");

program
  .command("quality")
  .description("檢查程式碼品質並同步至黑板")
  .argument("<filepath>", "檔案路徑")
  .action(async (filepath) => {
    await reviewer.runTask(`品質檢查: ${filepath}`, async (context) => {
      const result = await checkQuality(filepath);
      return { type: "code_quality", filepath, issues: result.issues || [], score: result.score };
    });
  });

program
  .command("format")
  .description("檢查格式並同步至黑板")
  .argument("<filepath>", "檔案路徑")
  .action(async (filepath) => {
    await reviewer.runTask(`格式檢查: ${filepath}`, async (context) => {
      const result = await checkFormat(filepath);
      return { type: "code_format", filepath, isValid: result.valid };
    });
  });

program
  .command("logic")
  .description("檢查邏輯一致性並同步至黑板")
  .argument("<filepath>", "檔案路徑")
  .action(async (filepath) => {
    await reviewer.runTask(`邏輯檢查: ${filepath}`, async (context) => {
      const result = await checkLogic(filepath);
      return { type: "code_logic", filepath, errors: result.errors || [] };
    });
  });

program.parse();
