#!/usr/bin/env node

import { skillMarketplace } from "./index.js";
import { RemoteSkillLoader } from "../remote-loader.js";
import fs from "fs";

const args = process.argv.slice(2);
const command = args[0];

async function main() {
  await skillMarketplace.initialize();
  const remoteLoader = new RemoteSkillLoader();

  switch (command) {
    case "add":
      const url = args[1];
      if (!url) {
        console.log("用法: taonix-skill add <url>");
        process.exit(1);
      }
      const result = await remoteLoader.fetchAndInstall(url);
      if (result.success) {
        console.log(`✅ 成功從 ${url} 安裝新技能！`);
      }
      break;

    case "list":
      console.log("📦 Taonix 技能市場\n");
      const skills = skillMarketplace.listSkills();
      console.log("標準化技能 (Agentskills.io):");
      skills.standardized.forEach((s) => console.log(`  - ${s}`));
      
      console.log("\n內建舊版技能:");
      skills.builtIn.forEach((s) => {
        if (!skills.standardized.includes(s)) console.log(`  - ${s}`);
      });

      console.log("\n外部遺留技能:");
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
  taonix-skill add <url>         從遠端 URL 安裝技能 (Agentskills.io)
  taonix-skill install <name>    手動安裝技能
  taonix-skill remove <name>     移除技能
  taonix-skill help              顯示說明
`);
  }
}

main().catch(console.error);
