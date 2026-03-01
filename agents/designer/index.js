#!/usr/bin/env node

import { Command } from "commander";
import { generateUI } from "./lib/ui-generator.js";
import { generateComponent } from "./lib/component-generator.js";
import { analyzeUX } from "./lib/ux-analyzer.js";
import { BaseAgent } from "../lib/base-agent.js";

const program = new Command();
const designer = new BaseAgent("designer");

program
  .name("taonix-designer")
  .description("Taonix Designer Agent (Hardened) - UI/UX 設計專家")
  .version("14.1.0");

program
  .command("ui")
  .description("生成 UI 設計建議並同步至黑板")
  .argument("<type>", "類型 (mobile|desktop|dashboard)")
  .option("-c, --color <palette>", "色彩配置", "default")
  .action(async (type, options) => {
    await designer.runTask(`生成 UI 建議: ${type}`, async (context) => {
      const result = await generateUI(type, options.color);
      return { type: "ui_suggestion", ui_type: type, color: options.color, content: result };
    });
  });

program
  .command("component")
  .description("生成元件設計並同步至黑板")
  .argument("<name>", "元件名稱")
  .option("-t, --type <type>", "類型", "card")
  .action(async (name, options) => {
    await designer.runTask(`設計元件: ${name}`, async (context) => {
      const result = await generateComponent(name, options.type);
      return { type: "component_spec", name, component_type: options.type, spec: result };
    });
  });

program
  .command("ux")
  .description("分析專案 UX 並同步至黑板")
  .argument("<directory>", "專案目錄")
  .action(async (directory) => {
    await designer.runTask(`UX 分析: ${directory}`, async (context) => {
      const result = await analyzeUX(directory);
      return { type: "ux_audit", directory, findings: result.findings || [] };
    });
  });

program.parse();
