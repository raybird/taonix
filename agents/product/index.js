#!/usr/bin/env node

import { Command } from "commander";
import { generatePRD } from "./lib/prd-generator.js";
import { analyzeFeature } from "./lib/feature-analyzer.js";
import { createUserStory } from "./lib/user-story.js";

const program = new Command();

program
  .name("taonix-product")
  .description("Taonix Product Agent - 產品規劃專家")
  .version("1.0.0");

program
  .command("prd")
  .description("生成產品需求文檔")
  .argument("<title>", "產品標題")
  .option("-t, --type <type>", "產品類型 (app|web|api|plugin)", "web")
  .action(async (title, options) => {
    try {
      const result = await generatePRD(title, options.type);
      console.log(JSON.stringify({ success: true, data: result }, null, 2));
    } catch (error) {
      console.error(JSON.stringify({ success: false, error: error.message }));
      process.exit(1);
    }
  });

program
  .command("feature")
  .description("分析功能需求")
  .argument("<feature>", "功能名稱")
  .option("-d, --description <desc>", "功能描述", "")
  .action(async (feature, options) => {
    try {
      const result = await analyzeFeature(feature, options.description);
      console.log(JSON.stringify({ success: true, data: result }, null, 2));
    } catch (error) {
      console.error(JSON.stringify({ success: false, error: error.message }));
      process.exit(1);
    }
  });

program
  .command("story")
  .description("生成使用者故事")
  .argument("<role>", "使用者角色")
  .argument("<action>", "想要做什麼")
  .argument("<benefit>", "獲得什麼價值")
  .action(async (role, action, benefit) => {
    try {
      const result = await createUserStory(role, action, benefit);
      console.log(JSON.stringify({ success: true, data: result }, null, 2));
    } catch (error) {
      console.error(JSON.stringify({ success: false, error: error.message }));
      process.exit(1);
    }
  });

program.parse();
