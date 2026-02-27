#!/usr/bin/env node

import { Command } from "commander";
import { analyzeStructure } from "./lib/structure-analyzer.js";
import { analyzeDependencies } from "./lib/dependency-analyzer.js";
import { suggestArchitecture } from "./lib/architecture-suggestion.js";

const program = new Command();

program
  .name("taonix-oracle")
  .description("Taonix Oracle Agent - 架構分析專家")
  .version("1.0.0");

program
  .command("structure")
  .description("分析專案結構")
  .argument("<directory>", "專案目錄")
  .action(async (directory) => {
    try {
      const result = await analyzeStructure(directory);
      console.log(JSON.stringify({ success: true, data: result }, null, 2));
    } catch (error) {
      console.error(JSON.stringify({ success: false, error: error.message }));
      process.exit(1);
    }
  });

program
  .command("deps")
  .description("分析專案依賴")
  .argument("<directory>", "專案目錄")
  .action(async (directory) => {
    try {
      const result = await analyzeDependencies(directory);
      console.log(JSON.stringify({ success: true, data: result }, null, 2));
    } catch (error) {
      console.error(JSON.stringify({ success: false, error: error.message }));
      process.exit(1);
    }
  });

program
  .command("suggest")
  .description("提供架構建議")
  .argument("<directory>", "專案目錄")
  .action(async (directory) => {
    try {
      const result = await suggestArchitecture(directory);
      console.log(JSON.stringify({ success: true, data: result }, null, 2));
    } catch (error) {
      console.error(JSON.stringify({ success: false, error: error.message }));
      process.exit(1);
    }
  });

program.parse();
