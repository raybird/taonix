#!/usr/bin/env node

import { Command } from "commander";
import { getGithubTrending } from "./lib/github-trending.js";
import { searchWeb } from "./lib/web-search.js";
import { BaseAgent } from "../lib/base-agent.js";

const program = new Command();
const explorer = new BaseAgent("explorer");

program
  .name("taonix-explorer")
  .description("Taonix Explorer Agent (Hardened) - 具備黑板意識的搜尋專家")
  .version("14.1.0");

program
  .command("github-trending")
  .description("取得 GitHub Trending 專案並同步至黑板")
  .option("-l, --language <lang>", "篩選語言", "")
  .action(async (options) => {
    await explorer.runTask(`取得 ${options.language || "Global"} GitHub 趨勢`, async (context) => {
      // 實體邏輯：執行爬蟲
      const repos = await getGithubTrending(options.language);
      
      // 紮實化：返回結構化數據供 BaseAgent 更新事實牆
      return {
        type: "trending_report",
        language: options.language || "all",
        top_repos: repos.slice(0, 5).map(r => ({ name: r.name, stars: r.stars })),
        timestamp: new Date().toISOString()
      };
    });
  });

program
  .command("web-search")
  .description("搜尋網頁內容並同步至黑板")
  .argument("<query>", "搜尋關鍵字")
  .option("-n, --num <number>", "結果數量", "5")
  .action(async (query, options) => {
    await explorer.runTask(`搜尋網頁: ${query}`, async (context) => {
      // 實體邏輯：執行網頁搜尋
      const results = await searchWeb(query, parseInt(options.num));
      
      return {
        type: "web_fact",
        query,
        summary: results.map(r => r.title).join(" | "),
        source_count: results.length
      };
    });
  });

program.parse();
