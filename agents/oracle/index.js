#!/usr/bin/env node

import { Command } from "commander";
import { analyzeStructure } from "./lib/structure-analyzer.js";
import { analyzeDependencies } from "./lib/dependency-analyzer.js";
import { suggestArchitecture } from "./lib/architecture-suggestion.js";
import { BaseAgent } from "../lib/base-agent.js";

const program = new Command();
const oracle = new BaseAgent("oracle");

program
  .name("taonix-oracle")
  .description("Taonix Oracle Agent (Hardened) - 架構分析專家")
  .version("14.1.0");

program
  .command("structure")
  .description("分析專案結構並同步至黑板")
  .argument("<directory>", "專案目錄")
  .action(async (directory) => {
    await oracle.runTask(`架構分析: ${directory}`, async (context) => {
      const result = await analyzeStructure(directory);
      return { type: "project_structure", directory, nodes: result.nodes || [] };
    });
  });

program
  .command("deps")
  .description("分析依賴並同步至黑板")
  .argument("<directory>", "專案目錄")
  .action(async (directory) => {
    await oracle.runTask(`依賴檢查: ${directory}`, async (context) => {
      const result = await analyzeDependencies(directory);
      return { type: "dependency_map", directory, dependencies: result.deps || [] };
    });
  });

program
  .command("suggest")
  .description("提供架構建議並同步至黑板")
  .argument("<directory>", "專案目錄")
  .action(async (directory) => {
    await oracle.runTask(`優化建議: ${directory}`, async (context) => {
      const result = await suggestArchitecture(directory);
      return { type: "architecture_proposal", directory, suggestions: result.proposals || [] };
    });
  });

program.parse();
