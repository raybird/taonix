#!/usr/bin/env node

import { Command } from "commander";
import { generateTest } from "./lib/test-generator.js";
import { runTests } from "./lib/test-runner.js";
import { createTestPlan } from "./lib/test-plan.js";

const program = new Command();

program
  .name("taonix-tester")
  .description("Taonix Tester Agent - 測試專家")
  .version("1.0.0");

program
  .command("generate")
  .description("生成測試案例")
  .argument("<file>", "測試目標檔案")
  .option("-t, --type <type>", "測試類型 (unit|integration|e2e)", "unit")
  .action(async (file, options) => {
    try {
      const result = await generateTest(file, options.type);
      console.log(JSON.stringify({ success: true, data: result }, null, 2));
    } catch (error) {
      console.error(JSON.stringify({ success: false, error: error.message }));
      process.exit(1);
    }
  });

program
  .command("run")
  .description("執行測試")
  .option("-p, --path <path>", "測試路徑", "./test")
  .option("-c, --coverage", "生成覆蓋率報告", false)
  .action(async (options) => {
    try {
      const result = await runTests(options.path, options.coverage);
      console.log(JSON.stringify({ success: true, data: result }, null, 2));
    } catch (error) {
      console.error(JSON.stringify({ success: false, error: error.message }));
      process.exit(1);
    }
  });

program
  .command("plan")
  .description("生成測試計劃")
  .argument("<feature>", "功能名稱")
  .option("-d, --description <desc>", "功能描述", "")
  .action(async (feature, options) => {
    try {
      const result = await createTestPlan(feature, options.description);
      console.log(JSON.stringify({ success: true, data: result }, null, 2));
    } catch (error) {
      console.error(JSON.stringify({ success: false, error: error.message }));
      process.exit(1);
    }
  });

program.parse();
