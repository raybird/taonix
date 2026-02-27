#!/usr/bin/env node

import { scheduleTask } from "./lib/scheduler-helper.js";
import { searchMemory } from "./lib/memory-helper.js";
import { analyzeRequest } from "./lib/analyzer.js";

const args = process.argv.slice(2);

if (args.length === 0) {
  console.log(`
Taonix Assistant Agent
======================
用法:
  assistant schedule <task> <cron>  - 建立排程任務
  assistant memory <query>          - 搜尋記憶
  assistant analyze <input>         - 分析請求
  `);
  process.exit(0);
}

const command = args[0];

switch (command) {
  case "schedule":
    if (args.length < 3) {
      console.error("用法: assistant schedule <task> <cron>");
      process.exit(1);
    }
    await scheduleTask(args[1], args[2]);
    break;

  case "memory":
    if (args.length < 2) {
      console.error("用法: assistant memory <query>");
      process.exit(1);
    }
    await searchMemory(args.slice(1).join(" "));
    break;

  case "analyze":
    if (args.length < 2) {
      console.error("用法: assistant analyze <input>");
      process.exit(1);
    }
    await analyzeRequest(args.slice(1).join(" "));
    break;

  default:
    console.error(`未知指令: ${command}`);
    process.exit(1);
}
