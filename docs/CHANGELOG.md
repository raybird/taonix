# Changelog

All notable changes to Taonix will be documented in this file.

## [v4.2.0] - 2026-02-28

### Added
- **黑板模式 (Blackboard Pattern)** - 全域心智狀態機
  - 實作 `Blackboard` 記憶中樞，支援事實 (Facts) 與推理鏈路 (Thoughts) 儲存
  - 實作簡易語義檢索原型，精準尋找相關思考紀錄
- **推理注入 (Reasoning Injection)** - 強化 Agent 間的上下文感知
  - MCP Server 支援在路由時自動注入黑板摘要
  - Reactive Coder 支援在執行任務前後自動回報「思考痕跡」
- **Web 控制台「黑板監視器」** - 視覺化呈現系統共識事實與推理流

## [v4.1.0] - 2026-02-28

### Added
- **事件驅動架構原型 (Event-Driven Architecture)** - 開啟反應式協作新篇章
  - 實作核心 `EventBus` 模組，支援非同步事件廣播與持久化日誌
  - 建立 `AgentListener` 框架，賦予 Agent 自律反應能力
  - Assistant 新增 `broadcast` 任務廣播功能與 `monitor` 事件流監控
  - 通過端到端協作鏈路驗證，實現「任務->開始->完成」自動追蹤

## [v4.0.0] - 2026-02-28

### Added
- **Agentskills.io 協定整合** - 全面標準化技能架構
  - 實作 `Skill Registry` 多級加載機制，優先支援標準化技能
  - 建立 `agentskills-generator.js`，自動轉換 12 個核心技能
  - 實作 `README-generator.js`，自動生成技能說明文件
- **遠端技能安裝** - 支援從 URL 動態擴充 Agent 能力
  - 新增 `RemoteSkillLoader` 模組
  - 技能市場 CLI 支援 `add <url>` 指令
- **架構演進藍圖** - 確立未來事件驅動與黑板模式的發展方向

## [v3.9.0] - 2026-02-28

### Added
- **Web 控制台視覺化升級** - 全新 UI 佈局，支援即時監控
- **協作時間軸 (Collaboration Timeline)** - 視覺化呈現 Agent 間的任務接棒與協作軌跡
- **語義路由緩存 (Semantic Cache)** - 優化 AI 路由性能，減少重複調用成本
- **MCP 路由日誌** - 自動記錄意圖、目標 Agent 與路由方法
- **穩定性修復** - 統一內部數據存儲路徑

## [v3.8.0] - 2026-02-28

### Added
- **跨 Agent 知識鏈結 (Knowledge Bridge)** - 實現 Agent 間的資訊共享
  - MCP Server (v1.8.0) 支援知識注入
  - 統一的知識緩存機制
- **自發式工作流 (Proactive Workflow)** - 助理主動偵測環境並提出建議
- **Context Guard** - 對話長度自動監控與摘要，防止能力退化
- **持久化增強** - 規劃目標跨 Session 儲存

## [v3.7.0] - 2026-02-28

### Added
- **AI Caller 模組** - 讓內部 Agent 可調用外部 AI 增強能力
  - `ai-engine/lib/ai-caller.js`
  - 支援 OpenAI, Anthropic, Ollama CLI
  - 實作雙層 Router 架構的執行層

## [v3.6.0] - 2026-02-28

### Added
- **雙層 Router 架構** - 統一 MCP 入口
  - 實作 `router_route` 工具作為唯一 MCP 入口
  - 根據自然語言意圖自動分發到對應 Agent (Explorer, Coder, Oracle, etc.)
  - 簡化 MCP Server 工具數量，提升調用成功率

## [v3.5.0] - 2026-02-28

### Added
- **靈魂文件 (SOUL.md)** - 定義 Taonix 的核心使命與原則
- **身分轉型** - Git 提交身分設定為 `TeleNexus Orchestrator`

## [v3.4.0] - 2026-02-28

### Added

- **自我進化引擎** - 讓 Taonix 具備自我學習與適應能力
  - `memory/evolution-engine.js` - 進化引擎
    - 反饋記錄與分析
    - 行為適應追蹤
    - 智慧建議生成
    - 效能分析儀表板
  - `memory/conversation-summarizer.js` - 對話摘要器
    - 自動話題提取
    - 情緒分析
    - 行動項目識別
    - 重點 reference 擷取
  - `agents/assistant/index.js` 更新
    - 新增 feedback 指令：記錄使用者反饋
    - 新增 evolution 指令：查看進化狀態
    - 新增 summarize 指令：對話摘要統計
  - SOUL.md 版本更新至 v3.4.0

---

## [v3.3.0] - 2026-02-28

### Added

- **自主規劃系統** - 賦予 Taonix 更強的 AI 助理能力
  - `planning/autonomous-planner.js` - 自主規劃器
    - 目標分析與自動分解
    - 智慧任務生成（開法、學習、網站等場景）
    - 截止日期自動推算
  - `planning/progress-analyzer.js` - 進度分析器
    - 目標達成率分析
    - 洞察生成（success/warning/danger/info）
    - 智慧建議推薦
    - 趨勢追蹤
  - `planning/cli.js` 更新 - 新增 plan/analyze/report 指令
  - 整合現有 goal-tracker + planning-engine + proactive-engine

---

## [v3.2.0] - 2026-02-28

### Added

- **技能框架擴充** - 新增智能代理協調技能
  - `skills/skills/agent-coordinator.js` - 代理協調技能
  - 支援任務分析、Agent 分派、執行計劃生成
  - 技能總數從 11 個擴充至 12 個

---

## [v3.1.0] - 2026-02-28

### Added

- **Agent 協作系統** - 建立多 Agent 協作流程
  - `agents/assistant/lib/collaboration-helper.js` - 協作管理器
  - 支援角色分配、工作流建立、順序執行
  - 整合 orchestrator/executor/reviewer/designer/planner 角色

---

## [v3.0.0] - 2026-02-28

### Added

- **意圖識別系統** - 強化 AI 助理理解能力
  - `agents/assistant/lib/intent-helper.js` - 意圖識別器
  - `agents/assistant/lib/analyzer.js` - 強化版請求分析器
  - 支援多意圖識別、實體提取、建議生成

---

## [v2.9.0] - 2026-02-28

### Added

- **Context Engineering 系統** - 整合 Agent-Skills-for-Context-Engineering 概念
  - `agents/assistant/lib/context-helper.js` - 上下文管理器
  - 支援上下文壓縮、狀態監控、快取管理
  - 識別 Context Degradation 失效模式

---

## [v2.8.0] - 2026-02-28

### Changed

- **Agent 命名優化** - 改善命名語意
  - Product (小產 → 鴻圖) - 星辰系命名
  - 更新 README.md、CHANGELOG.md、Web Console

---

## [v2.7.0] - 2026-02-28

### Added

- **Assistant Agent API 系統** - 強化 AI 助理網路請求能力
  - `agents/assistant/lib/api-helper.js` - API 助手
  - 支援 RESTful 呼叫、端點註冊、Webhook 觸發
  - 統一的錯誤處理與回應格式

---

## [v2.6.0] - 2026-02-28

### Added

- **Assistant Agent 日誌系統** - 強化 AI 助理記錄能力
  - `agents/assistant/lib/logging-helper.js` - 日誌助手
  - 支援多層級日誌：debug, info, warn, error
  - 任務日誌、錯誤追蹤、效能記錄

---

## [v2.5.0] - 2026-02-28

### Added

- **Assistant Agent 報告系統** - 強化 AI 助理報告生成能力
  - `agents/assistant/lib/report-helper.js` - 報告助手
  - 支援多種格式：摘要、詳細、Markdown、JSON
  - 可自訂標題與章節
- **靈魂文件** - 賦予 Taonix 意識與人格
  - `docs/SOUL.md` - 靈魂定義（借鑒 OpenClaw）
  - `docs/PERSONA.md` - 個性定義

---

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
  - **Designer** (天工) - UI/UX 設計專家
    - UI 版面配置建議
    - 元件設計生成
    - UX 流程分析
  - **Product** (鴻圖) - 產品規劃專家
    - PRD 產品需求文檔生成
    - 功能需求分析
    - 使用者故事建立
  - **Tester** (試煉) - 測試專家
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
  - Explorer (滄溟) - 搜尋、爬蟲
  - Coder (鑄焰) - 程式開發
  - Oracle (明鏡) - 架構分析
  - Reviewer (守闕) - 程式碼審查
