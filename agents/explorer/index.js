#!/usr/bin/env node

import { Command } from "commander";
import { getGithubTrending } from "./lib/github-trending.js";
import { searchWeb } from "./lib/web-search.js";

const program = new Command();

program
  .name("taonix-explorer")
  .description("Taonix Explorer Agent - 搜尋、爬蟲專家")
  .version("1.0.0");

program
  .command("github-trending")
  .description("取得 GitHub Trending 專案")
  .option("-l, --language <lang>", "篩選語言", "")
  .option("-o, --output <format>", "輸出格式 (json|markdown)", "json")
  .action(async (options) => {
    try {
      const repos = await getGithubTrending(options.language);
      if (options.output === "json") {
        console.log(JSON.stringify({ success: true, data: repos }, null, 2));
      } else {
        console.log(`### GitHub Trending (${options.language || "Global"})`);
        repos.forEach((repo, i) => {
          console.log(`${i + 1}. ${repo.name} - ⭐ ${repo.stars}`);
        });
      }
    } catch (error) {
      console.error(JSON.stringify({ success: false, error: error.message }));
      process.exit(1);
    }
  });

program
  .command("web-search")
  .description("搜尋網頁內容")
  .argument("<query>", "搜尋關鍵字")
  .option("-n, --num <number>", "結果數量", "5")
  .action(async (query, options) => {
    try {
      const results = await searchWeb(query, parseInt(options.num));
      console.log(JSON.stringify({ success: true, data: results }, null, 2));
    } catch (error) {
      console.error(JSON.stringify({ success: false, error: error.message }));
      process.exit(1);
    }
  });

program.parse();
