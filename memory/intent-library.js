import { blackboard } from "./blackboard.js";

/**
 * Taonix Intent Library (v17.0.0)
 * 提供標準化的意圖模板，引導外部 Agent 高質量輸入。
 */
export class IntentLibrary {
  constructor() {
    this.templates = {
      "code_fix": "請分析 [file_path] 中的錯誤，並根據黑板中的先前事實提出修復建議。",
      "arch_scan": "請針對 [directory] 執行全目錄結構掃描，並產出依賴拓樸事實。",
      "test_gen": "請為 [file_path] 內的邏輯實作 100% 覆蓋的單元測試腳本。",
      "trend_report": "請搜尋 GitHub 今日熱門的 [language] 專案並彙整至黑板。"
    };
    this.init();
  }

  init() {
    console.log("[IntentLib] 意圖模板庫已載入，共 ${Object.keys(this.templates).length} 組模板。");
    // 同步模板到黑板，讓外部 Agent 可讀取
    blackboard.updateFact("intent_templates", this.templates, "intent-library");
  }

  getTemplate(key) {
    return this.templates[key];
  }
}

export const intentLibrary = new IntentLibrary();
