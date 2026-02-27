#!/usr/bin/env node

import { statusDashboard } from "../party/status-dashboard.js";
import partyCoordinator from "../party/party-coordinator.js";

const args = process.argv.slice(2);
const command = args[0];

async function main() {
  switch (command) {
    case "status":
      const sessionId = args[1];
      console.log(await statusDashboard.printStatus(sessionId));
      break;

    case "sessions":
      const sessions = partyCoordinator.getAllSessions();
      console.log(statusDashboard.renderSessionTable(sessions));
      break;

    case "clear":
      console.log(statusDashboard.clearAllSessions());
      break;

    case "help":
    default:
      console.log(`
Taonix Party Mode CLI

使用方法:
  taonix-party status [sessionId]   查看狀態儀表板
  taonix-party sessions             查看所有會話
  taonix-party clear                清除所有會話
  taonix-party help                 顯示說明
`);
  }
}

main().catch(console.error);
