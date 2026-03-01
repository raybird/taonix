#!/usr/bin/env node

import { Command } from "commander";
import { analyzeStructure } from "./lib/structure-analyzer.js";
import { analyzeDependencies } from "./lib/dependency-analyzer.js";
import { suggestArchitecture } from "./lib/architecture-suggestion.js";
import { BaseAgent } from "../lib/base-agent.js";
import { intentLibrary } from "../../memory/intent-library.js";
import fs from "fs";
import path from "path";

const program = new Command();
const oracle = new BaseAgent("oracle");

program
  .name("taonix-oracle")
  .description("Taonix Oracle Agent (Evolution) - 環境感知架構專家")
  .version("18.1.0");

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
  .command("scan-projects")
  .description("掃描開發環境並自動生成/更新意圖模板")
  .action(async () => {
    await oracle.runTask("掃描開發環境並更新模板", async (context) => {
      const projectsDir = path.resolve(process.cwd(), "projects");
      const projects = fs.readdirSync(projectsDir).filter(f => fs.statSync(path.join(projectsDir, f)).isDirectory());
      
      const newTemplates = {};
      projects.forEach(p => {
        newTemplates[`refactor_${p}`] = `請針對 projects/${p} 進行商用化深度重構，包含型別加固與單元測試。`;
      });

      // 執行熱加載
      intentLibrary.hotLoad(newTemplates);
      
      return { type: "intent_generation", count: Object.keys(newTemplates).length, projects };
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
