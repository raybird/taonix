#!/usr/bin/env node

import { skillMarketplace } from "./index.js";
import fs from "fs";

const args = process.argv.slice(2);
const command = args[0];

async function main() {
  await skillMarketplace.initialize();

  switch (command) {
    case "list":
      console.log("📦 Taonix 技能市場\n");
      const skills = skillMarketplace.listSkills();
      console.log("內建技能:");
      skills.builtIn.forEach((s) => console.log(`  - ${s}`));
      console.log("\n外部技能:");
      skills.external.length > 0
        ? skills.external.forEach((s) => console.log(`  + ${s}`))
        : console.log("  (無)");
      break;

    case "install":
      const skillName = args[1];
      const skillModule = JSON.parse(args[2] || "{}");
      if (!skillName) {
        console.log("用法: taonix-skill install <name> <module-json>");
        process.exit(1);
      }
      console.log(await skillMarketplace.installSkill(skillName, skillModule));
      break;

    case "remove":
      const removeName = args[1];
      if (!removeName) {
        console.log("用法: taonix-skill remove <name>");
        process.exit(1);
      }
      console.log(await skillMarketplace.removeSkill(removeName));
      break;

    case "help":
    default:
      console.log(`
📦 Taonix 技能市場 CLI

用法:
  taonix-skill list              列出所有技能
  taonix-skill install <name>    安裝技能
  taonix-skill remove <name>     移除技能
  taonix-skill help              顯示說明
`);
  }
}

main().catch(console.error);
