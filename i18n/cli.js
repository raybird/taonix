#!/usr/bin/env node

import { i18n } from "./index.js";

const args = process.argv.slice(2);
const command = args[0];

async function main() {
  switch (command) {
    case "locale":
      if (args[1]) {
        console.log(i18n.setLocale(args[1]));
      } else {
        console.log("目前語言:", i18n.getLocale());
      }
      break;

    case "list":
      console.log("支援的語言:");
      i18n.getAvailableLocales().forEach((l) => console.log(`  - ${l}`));
      break;

    case "t":
      const key = args[1];
      console.log(i18n.t(key));
      break;

    case "add":
      const locale = args[1];
      const transJson = args[2];
      if (locale && transJson) {
        try {
          const translations = JSON.parse(transJson);
          console.log(i18n.addTranslation(locale, translations));
        } catch (e) {
          console.log("用法: taonix-i18n add <locale> <json>");
        }
      } else {
        console.log("用法: taonix-i18n add <locale> <json>");
      }
      break;

    case "help":
    default:
      console.log(`
🌐 Taonix 多語言 CLI

用法:
  taonix-i18n locale [lang]    查看/設定語言
  taonix-i18n list             列出支援語言
  taonix-i18n t <key>          翻譯 key
  taonix-i18n add <lang> <json> 新增翻譯
  taonix-i18n help             顯示說明
`);
  }
}

main().catch(console.error);
