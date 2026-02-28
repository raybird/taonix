# Changelog

All notable changes to Taonix will be documented in this file.

## [v2.4.0] - 2026-02-28

### Added

- **Assistant Agent 工作流系統** - 強化 AI 助理任務自動化
  - `agents/assistant/lib/workflow-helper.js` - 工作流助手
  - 支援建立工作流、順序執行步驟、錯誤處理
  - 可用於自動化多步驟任務

---

## [v2.3.0] - 2026-02-28

### Added

- **Assistant Agent 翻譯系統** - 強化 AI 助理多語言能力
  - `agents/assistant/lib/translation-helper.js` - 翻譯助手
  - 支援多語言翻譯、語言偵測、批次翻譯
  - 支援中、英、日、韓、西、法、德等語言

---

## [v2.2.0] - 2026-02-28

### Added

- **Assistant Agent 通知系統** - 強化 AI 助理提醒能力
  - `agents/assistant/lib/notification-helper.js` - 通知助手
  - 支援即時通知、排程提醒、多管道通知
  - 可透過 Telegram、Email、Console 發送通知

---

## [v2.1.0] - 2026-02-28

### Added

- **Assistant Agent 數據分析** - 強化 AI 助理分析能力
  - `agents/assistant/lib/analytics-helper.js` - 數據分析助手
  - 支援統計分析、數據分佈、異常偵測
  - 可生成數據報告

---

## [v2.0.0] - 2026-02-28

### Added

- **Assistant Agent 強化** - 擴充 AI 助理能力
  - `agents/assistant/lib/system-helper.js` - 系統助手 (指令執行、狀態檢查)
  - `agents/assistant/lib/web-helper.js` - 網路助手 (搜尋、擷取網頁)
  - 支援指令執行、系統監控、網頁搜尋等功能
- **排程調整** - 執行時間調整至 :15, :45 與其他排程錯開
- **進化方向** - 以「AI 助理能力」為核心持續進化

---

## [v1.9.0] - 2026-02-28

### Added

- **個人助理 Agent** - 賦予 TeleNexus AI 助理能力
  - `agents/assistant/index.js` - 助理主程式
  - `agents/assistant/lib/scheduler-helper.js` - 排程助手
  - `agents/assistant/lib/memory-helper.js` - 記憶助手
  - `agents/assistant/lib/analyzer.js` - 請求分析器
  - `agents/assistant/test.js` - 測試檔案
  - Agent 總數從 7 個擴充至 8 個
- **進化方向調整** - 以「AI 助理」為核心持續進化

---

## [v1.8.0] - 2026-02-28

### Added

- **技能框架擴充** - 新增 3 個專業技能
  - `skills/skills/security-audit.js` - 安全審計技能
  - `skills/skills/doc-generator.js` - 文檔生成技能
  - `skills/skills/performance-optimization.js` - 效能優化技能
  - 技能總數從 8 個擴充至 11 個

---

## [v1.7.0] - 2026-02-28

### Added

- **測試覆蓋強化** - 為新增 Agent 完善測試
  - `agents/designer/test.js` - UI/UX 測試
  - `agents/product/test.js` - 產品管理測試
  - `agents/tester/test.js` - 測試生成與計劃測試
  - 使用 Node.js native test runner

---

## [v1.6.0] - 2026-02-28

### Added

- **MCP Server 擴展** - 新增 7 個工具
  - Designer: generate_ui, generate_component, analyze_ux
  - Product: generate_prd, analyze_feature, create_story
  - Tester: create_test_plan
  - 版本更新至 1.6.0

---

## [v1.5.0] - 2026-02-28

### Added

- **多語言支援** - 支援中英日翻譯
  - `i18n/index.js` - i18n 核心模組
  - `i18n/cli.js` - 多語言 CLI
  - 支援語言: 中文、英文、日文
  - 可擴充翻譯

---

## [v1.4.0] - 2026-02-28

### Added

- **長期規劃** - 子目標分解與追蹤
  - `planning/goal-tracker.js` - 目標追蹤器
  - `planning/planning-engine.js` - 規劃引擎
  - `planning/cli.js` - 長期規劃 CLI
  - 支援建立目標、子目標、進度追蹤
- **主動式建議** - 主動預測使用者需求
  - `planning/suggestion-engine.js` - 建議引擎
  - `planning/proactive-engine.js` - 主動式引擎
  - 根據使用模式生成智慧建議

---

## [v1.3.0] - 2026-02-27

### Added

- **第三方技能市場** - 允許載入外部技能
  - `skills/marketplace/index.js` - 技能市場核心
  - `skills/marketplace/cli.js` - 技能管理 CLI
  - 支援安裝/移除外部技能
- **Web UI 控制台** - 圖形化控制面板
  - `web-console/index.html` - 控制台頁面
  - `web-console/server.js` - HTTP 伺服器
  - 即時查看 Agent 狀態與統計

---

## [v1.2.0] - 2026-02-27

### Added

- **更多領域 Agent** - 新增 3 個專業 Agent
  - **Designer** (小設) - UI/UX 設計專家
    - UI 版面配置建議
    - 元件設計生成
    - UX 流程分析
  - **Product** (小產) - 產品規劃專家
    - PRD 產品需求文檔生成
    - 功能需求分析
    - 使用者故事建立
  - **Tester** (小測) - 測試專家
    - 測試案例自動生成
    - 測試執行
    - 測試計劃建立
- **Agent 團隊擴展** - 從 4 個擴展到 7 個

---

## [v1.1.0] - 2026-02-27

### Added

- **狀態儀表板** - Party Mode 即時狀態監控
  - CLI 命令查看會話狀態
  - 顯示所有 Agent 執行狀態與時間
  - 支援清除會話
- **Git Config 身份設定** - TeleNexus Orchestrator

---

## [v1.0.0] - 2026-02-27

### Added

- **技能框架核心 (Skills Core)** - 8 個技能自動觸發
  - brainstorming - 頭腦風暴
  - systematic-debugging - 系統化除錯 (4 階段根因分析)
  - test-driven-development - TDD 流程
  - receiving-code-review - 接收審查回饋
  - requesting-code-review - 請求程式碼審查
  - writing-plans - 撰寫實作計劃
  - executing-plans - 執行實作計劃
  - verification-before-completion - 完成前驗證
- **技能匹配引擎** - 根據輸入關鍵字自動選擇正確技能
- **自我學習模組** - 記住使用者偏好與統計數據
- **AI Engine** - 意圖理解、Agent 調度、內容生成
- **SOP 文件** - 標準作業程序
- **演化規則** - 每次進化完成後 SOP 對齊 + commit + push

### Changed

- 整合現 團隊 (有 4 AgentExplorer, Coder, Oracle, Reviewer)
- 更新所有設計文件以反映最新架構

---

## [v0.3.0] - 2026-02-21

### Added

- **TeleNexus 整合** - 與主系統整合
  - client.js
  - agents.js
  - telenexus-config.json

---

## [v0.2.0] - 2026-02-20

### Added

- **MCP Server** - 13 tools
  - @modelcontextprotocol/sdk 整合

---

## [v0.1.0] - 2026-02-15

### Added

- **4 個 Agent CLI 框架**
  - Explorer (小探) - 搜尋、爬蟲
  - Coder (小碼) - 程式開發
  - Oracle (小析) - 架構分析
  - Reviewer (把關) - 程式碼審查
