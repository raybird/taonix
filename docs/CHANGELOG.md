# Changelog

All notable changes to Taonix will be documented in this file.

## [v0.6.0] - 2026-02-27

### Added

- **規模自適應** - 根據任務複雜度自動選擇 Agent 組合
  - 簡單任務 → Explorer
  - 中等任務 → Explorer + Coder
  - 複雜任務 → Explorer + Coder + Oracle + Reviewer (Party Mode)
- **任務歷史追蹤** - 記錄並查詢歷史任務
  - 自動記錄輸入、技能、Agent、執行時間
  - 支援按技能篩選、統計分析
- **多對話上下文記憶** - 跨對話保持上下文連貫
  - Session 管理、訊息歷史儲存
  - 支援查詢過往對話記錄
- **跨 session 偏好延續** - 使用者設定跨對話持久化
  - 使用者 Profile 管理（名稱、時區、語言）
  - 工作流追蹤與常用建議
- **ROADMAP.md** - 發展藍圖文件
- **SOP 文件同步規則** - 每次發布後必須同步文件

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
