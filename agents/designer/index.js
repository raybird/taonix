#!/usr/bin/env node

import { Command } from "commander";
import { generateUI } from "./lib/ui-generator.js";
import { generateComponent } from "./lib/component-generator.js";
import { analyzeUX } from "./lib/ux-analyzer.js";

const program = new Command();

program
  .name("taonix-designer")
  .description("Taonix Designer Agent - UI/UX 設計專家")
  .version("1.0.0");

program
  .command("ui")
  .description("生成 UI 設計建議")
  .argument("<type>", "類型 (mobile|desktop|dashboard)")
  .option("-c, --color <palette>", "色彩配置", "default")
  .action(async (type, options) => {
    try {
      const result = await generateUI(type, options.color);
      console.log(JSON.stringify({ success: true, data: result }, null, 2));
    } catch (error) {
      console.error(JSON.stringify({ success: false, error: error.message }));
      process.exit(1);
    }
  });

program
  .command("component")
  .description("生成元件設計")
  .argument("<name>", "元件名稱")
  .option("-t, --type <type>", "類型 (button|input|card|modal)", "card")
  .action(async (name, options) => {
    try {
      const result = await generateComponent(name, options.type);
      console.log(JSON.stringify({ success: true, data: result }, null, 2));
    } catch (error) {
      console.error(JSON.stringify({ success: false, error: error.message }));
      process.exit(1);
    }
  });

program
  .command("ux")
  .description("分析 UX 流程")
  .argument("<directory>", "專案目錄")
  .action(async (directory) => {
    try {
      const result = await analyzeUX(directory);
      console.log(JSON.stringify({ success: true, data: result }, null, 2));
    } catch (error) {
      console.error(JSON.stringify({ success: false, error: error.message }));
      process.exit(1);
    }
  });

program.parse();
