# Changelog

All notable changes to Taonix will be documented in this file.

## [v25.0.0] - 2026-03-03

### Added
- **結構化 IPC 協議 (Structured IPC Protocol)** — 統一 Dispatcher ↔ Agent 通訊管道
  - 新增 `agents/lib/ipc-output.js` IPC 輸出工具，提供 `emitResult()` 函式
  - Dispatcher 啟動 Agent 時注入 `TAONIX_IPC=1` 環境變數，啟用結構化模式
  - Dispatcher 透過 stdin 傳送 JSON 結構化輸入（command、args、metadata）
  - Agent 透過 `__TAONIX_RESULT__` sentinel 前綴輸出結構化 JSON 結果（success、taskId、data、score）
  - 向後相容：未升級的 Agent 自動回退至 exit-code + raw stdout 行為
  - `BaseAgent` 子類別（Explorer、Coder、Oracle、Reviewer、Designer）自動獲得 IPC 能力
  - 手動遷移 Tester、Product、Assistant 三個獨立 Agent
  - 整合測試新增結構化 IPC 驗證與向後相容測試

### Fixed
- 修復整合測試中 Blackboard Sync 跨進程同步問題（子進程 debounced save 後重新載入）

### Test Results
- 整合測試：6/6 通過（含 2 項新增 IPC 驗證）
- Coder 單元測試：6/6 通過

## [v26.0.0] - 2026-03-06

### Changed
- **Runtime Convergence** — 核心執行鏈收斂為單一控制面
  - `mcp-server` 不再自建第二套路由，統一委派至 `TaonixAI.run()`
  - `TaonixAI` 改為產生 `TaskSpec` / `ResultSpec`，並回傳真實 execution result
  - 新增 built-in capability registry，統一 `intent` / `task` / `agent` 對應
- **Runtime-first Agent Dispatch** — Dispatcher 優先直接載入 agent runtime module，CLI 僅保留 fallback
  - 新增 `agents/*/runtime.js`
  - `agent-dispatcher` 現在保留 `taskId`、同步寫入 `last_result_*` 事實，並維持相容舊 IPC 測試
- **Skill Runtime Repair** — 修復 Skill Architect / Sandbox / Loader / Registry 契約不一致
  - `SkillArchitect` 改為生成可驗證的 skill object expression
  - `sandbox` 支援 object-expression、`export default`、`module.exports`
  - `registry` 保留 `scriptCode`，ESM 載入失敗時可回退至 sandbox 執行
  - `remote-loader` 與 `skill engine` 統一 skill module 形狀
- **AICaller Multi-CLI Support** — AI CLI 呼叫擴充並可由呼叫端帶參數
  - 支援 `opencode run` / `gemini` / `codex exec` / `ollama run`
  - 新增 `TAONIX_AI_PROVIDER` / `TAONIX_AI_MODEL`
  - `AICaller.call()` 新增 `cliArgs`
  - `gemini` 預設改為官方建議的 positional prompt 形式；若呼叫端指定 `-p` / `-i` 等 flag，則依旗標插入 prompt
- **Integration Test Upgrade** — 整合測試升級為真實 user flow + golden shape 驗證
  - 新增 `tests/golden/ai-engine-flow-shapes.json`
  - 測試覆蓋 `github_trending` / `web_search` / `analyze_structure` / `check_quality`

### Fixed
- 修復 built-in capability 誤觸 skill auto-generation 的行為
- 修復 `TASK_ASSIGNED` event payload 與 schema 不一致
- 修復 `SkillArchitect` 產生 `Unexpected token 'export'` 的結構性問題
- 修復 `content-generation` 對失敗 result 的錯誤格式化

### Test Results
- 整合測試：10/10 通過
- 真實 AI flow 驗證：4/4 通過
- Skill sandbox 相容驗證：object-expression / `export default` 皆通過

## [v24.0.1] - 2026-03-03

### Fixed
- **P0 語法錯誤（4 處）** — 修復 `persona-adapter`、`semantic-validator`、`resource-gc`、`host-probe` 中的字串斷行導致模組無法載入
- **P1 硬編碼路徑（2 處）** — `container-control`、`container-orchestrator` 改用 `config/paths.js` 統一路徑管理，修復本機環境無法啟動的問題
- **P2 測試與實作 API 不一致（7 處）**
  - Designer: `component-generator` 補上 `props` 欄位、`ux-analyzer` 新增路徑存在性檢查與目錄權限容錯
  - Tester: `test-generator` 支援專案根目錄路徑回退、`test-plan` 補上 `name`/`phases` 與 complexity 分級、`test-runner` 補上 `passed`/`failed`/`total` 欄位
  - Assistant: `analyzer` 新增 `task` 意圖類別
  - Product: `feature-analyzer` 補上 `analysis` 欄位
- **P3 依賴與整合（3 處）**
  - 根 `package.json` 加入 `commander`（所有 Agent CLI 共用）
  - `integration/package.json` 加入 `@modelcontextprotocol/sdk` 依賴
  - `agent-dispatcher` 改為展開位置參數，相容 commander CLI 呼叫方式
  - `persona-adapter` 補上 `blackboard` import 與安全的事實讀取

### Test Results
- 整合測試：3/3 通過
- Agent 單元測試：60/60 通過（8 個 Agent 全數通過）

## [v24.0.0] - 2026-03-03

### Changed
- **AICaller 改用 opencode run** — 預設 AI 呼叫方式從 `npx openai` 切換至 `opencode run`，簡化依賴並提升穩定性
  - 新增 `setSystemPrompt()` 方法，修復 BaseAgent 執行時拋錯的 bug
  - 保留 `ollama` 作為備用 provider
  - 移除 `openai` provider 的 `npx` 呼叫方式
- **動態超時機制** — Agent Dispatcher 依據任務複雜度動態調整超時時間
  - 新增 `getTimeoutByComplexity()`：低 1 分鐘 / 中 3 分鐘 / 高 10 分鐘
  - 預設超時從 30 秒提高至 120 秒
  - MCP Hub 整合複雜度分析，自動傳遞 complexity level 給 Dispatcher

### Fixed
- 修復 `BaseAgent` 呼叫不存在的 `AICaller.setSystemPrompt()` 導致所有 Agent 執行崩潰
- 修復 `tests/test-integration.js` 中 console.log 換行符格式錯誤
- 更新 `.env.example` 反映 opencode 為預設 AI provider

## [v23.1.0] - 2026-03-03

### Changed
- **專案揭露優化 (Project Disclosure Optimization)** - 門面文件全面更新
  - 全面重寫 `README.md`，改為「5 分鐘上手」導向，含安裝指引與 MCP Client 設定範例
  - 新建根目錄 `package.json`，支援 `npm install` 一鍵安裝與 `npm start` 啟動
  - 擴充 `MANIFEST.json`，新增 requirements、quickstart、skills 完整清單、目錄結構說明
  - 全面重寫 `docs/README.md`，重新定位為技術深潛指南（9+3 Agent、13 技能、單一 taonix_hub API）
  - 更新 `integration/README.md`，移除 13 個舊工具清單，改為單一 `taonix_hub` 文檔與遷移指南
  - 新建 `.env.example` 環境變數範例
  - 新建 `.gitignore`

### Fixed
- 修正啟動路徑從錯誤的 `node projects/taonix/mcp-server/index.js` 改為 `node mcp-server/index.js`
- 修正 `MANIFEST.json` 中 `entry_points.mcp` 去掉多餘的 `node` 前綴

## [v23.0.0] - 2026-03-03

### Added
- **全球心智共識 (Global Mind Consensus)** - 跨地域事實一致性
  - 實作基於 Gossip 協議的全球心智共識機制，支援 Revision ID 校驗確保事實絕對真值
  - 實作增量指紋壓縮，降低事實廣播的網路負載
  - 實作 **跨節點熱遷移 (Live Migration)**：節點故障時自動移交任務執行權至健康節點
  - 實作 **集體榮譽共享 (Honor Sharing)**：Agent 成就在全球節點間即時同步
  - 統一能力加權指標，確保跨地域調度的一致性

## [v22.0.0] - 2026-03-02

### Added
- **集體成就與榮譽驅動 (Collective Achievement & Honor-based Dispatching)** - 激勵機制
  - 實作 `AchievementSystem` 集體成就系統，透過黑板事實記錄團隊卓越表現
  - 實作團隊成就牆 (Achievement Wall)，即時展示解鎖的榮譽勳章
  - 實作 **榮譽驅動調度**：高榮譽 Agent 自動獲得 15-20% 的調度權重加成
  - 實作 **自發式優化提案 (Self-Optimization)**：獲得勛章的專家可提交系統優化提案
  - 引導架構與配置進行自發性動態演進

## [v21.0.0] - 2026-03-02

### Added
- **協作默契與適應性人格 (Collaboration Synergy & Adaptive Persona)** - 團隊擬人化
  - 實作 `CollaborationSynergyEngine` 協作默契引擎，自動學習 Agent 間最佳協作模式
  - 實作 `AdaptivePersona` 適應性人格系統，Agent 依任務情境調整溝通風格
  - 實作 **情感持久化 (Emotional Persistence)**：持久化 Agent 的情感狀態與偏好
  - 跨 Session 保持 Agent 的個性與協作記憶

## [v20.0.0] - 2026-03-02

### Added
- **全面 Skill 化與原生 Bridge 整合 (Full Skill-ification & Native Bridge)** - 架構統一
  - 將所有 Agent 能力統一封裝為標準 Skill 架構
  - 實作原生 Bridge 整合，與底層系統建立直接通訊橋接
  - 消除 Agent 與 Skill 之間的概念分裂，實現能力的一致性管理

## [v19.0.0] - 2026-03-02

### Added
- **工業級加固 (Industrial Hardening)** - 生產就緒
  - 實作工業級沙盒加固，達到生產環境等級的安全執行隔離
  - 實作自癒健檢 (Health Check) 系統，主動診斷與告警
  - 實作 `ContextRecovery` 情境恢復機制，崩潰後自動還原推理上下文
  - Web 控制台升級為加固版，整合安全監控面板

## [v18.0.0] - 2026-03-02

### Added
- **團隊文化與 Gossip 共識 (Team Culture & Gossip Consensus)** - 組織智慧
  - 實作 `TeamCultureEngine` 團隊文化引擎，建立跨 Agent 協作規範
  - 實作意圖熱載入 (Hot-loading)，運行期動態載入新意圖定義
  - 實作 `GossipConsensus` 基於 Gossip 協議的跨節點事實同步機制
  - 支援增量式事實傳播，降低網路通訊開銷

## [v17.0.0] - 2026-03-02

### Added
- **語義驗證樞紐 (Semantic Validation Hub)** - 意圖精確化
  - 實作語義驗證樞紐，將意圖路由提升至語義級別
  - 實作意圖範本化 (Intent Templating)，支援可重複使用的意圖模板
  - 實作 Agent 自評分機制，Agent 自動評估自身執行品質
  - 提升意圖理解的精確度與可擴展性

## [v16.0.0] - 2026-03-01

### Added
- **資源編排與負載治理 (Resource Orchestration & Load Governance)** - 效能管控
  - 實作優先級驅動的資源節流 (Priority-driven Resource Throttling)
  - 實作每小時自動垃圾回收 (GC) 機制，清理過期狀態與日誌
  - 實作負載可視化面板，即時展示各 Agent 資源使用率
  - Hub 封裝重構：將內部 Agent 重新封裝於 `taonix_hub` 統一入口

## [v15.0.0] - 2026-03-01

### Added
- **自主效能分析 (Intelligent Self-Profiling)** - 效能洞察
  - 實作自主效能分析引擎，Agent 自動識別效能瓶頸
  - 實作瓶頸診斷 (Bottleneck Diagnosis) 系統，智慧化定位系統級問題
  - 實作效能儀表板 (Performance Dashboard)，整合於 Web 控制台

## [v14.0.0 - v14.1.0] - 2026-03-01

### Added
- **穩定性加固與 Agent 實體化 (Stability Hardening & Agent Implementation)** - 品質基石
  - 重構 `BaseAgent` 統一基底類別，消除各 Agent 間的重複邏輯
  - 實作 Dispatcher Retry/Timeout 機制，調度器支援重試與超時容錯
  - 實作路徑解耦 (`config/paths.js`)，集中管理所有資料路徑
  - 實作事件 Schema 驗證器 (`event-schema.js`)，確保型別化事件的正確性
  - 完成所有 Agent 的完整實作與端對端整合測試

## [v13.0.0] - 2026-03-01

### Added
- **分散式意識 (Distributed Consciousness)** - 去中心化通訊
  - 實作 P2P Mesh 網路，建立 Agent 間的去中心化通訊拓樸
  - 實作增強沙盒，支援跨節點檔案交換的安全沙盒機制
  - 架構精煉：修復 AICaller systemPrompt 問題，解耦路徑管理
  - 實作端對端 Dispatcher，完成意圖到執行的完整鏈路

## [v12.0.0] - 2026-03-01

### Added
- **叢集級自動自癒與控制 (Cluster-level Control)** - 從感知到干預
  - 實作 `SSHProxy` 遠端代理，支援透過 SSH 隧道向宿主機發送即時 Docker 管理指令
  - 實作 `ClusterController` 控制信號系統，支援在受限環境下透過「信號投放」執行非同步自癒
  - 整合自癒鏈路：`SelfHealingAgent` 具備「SSH 即時修復 + 檔案中轉備援」的雙軌制控制邏輯
  - 實現對外部異常容器的 100% 自動重啟閉環，將 Taonix 轉型為「實體環境掌控者」

## [v11.0.0] - 2026-03-01

### Added
- **跨域協作與叢集感知 (Cross-Domain Orchestration)** - 突破容器邊界
  - 實作 `ContainerOrchestrator`，支援感測宿主機上運行的其他 Docker 容器服務
  - 實作 `HostProbe` 物理探針，提供宿主機磁碟、負載與運行時間的實時監控
  - 實作 `NotificationCenter`，支援將重大系統事件與任務進度推送至 Discord/Slack Webhook
  - Web 控制台升級為「全球實體監控版 (Global Entity Monitor)」，整合外部容器與宿主機指標
  - 實現從單體 AI 助理到「叢集級數位管家」的轉型

## [v10.0.0] - 2026-03-01

### Added
- **Nexus 實體整合與系統自癒 (Nexus Integration & Self-Healing)** - 助理能力的終極閉環
  - 實作 `SelfHealingAgent`，具備自動環境診斷與配置一致性檢查能力
  - 實作 `MemoriaBridge`，將重大決策與維護經驗同步至底層長期記憶系統 (Memoria)
  - 實作 `ProductivityTracker`，量化 AI 助理產出的價值與節省的人工小時
  - Web 控制台升級為九欄式全監控佈局，整合健康得分與價值回報面板
  - 完成從本地開發到系統級自律維護的完整演進

## [v9.0.0] - 2026-03-01

### Added
- **長程工程編排 (Long-Horizon Orchestration)** - 實現大規模任務執行
  - 實作 `TaskStateMachine` 長程任務狀態機，支援斷點續傳與跨日持久化
  - 實作 `LongTaskOrchestrator` 編排器，自動將複雜目標轉化為多步驟 Agent 工作流
  - 整合 `EventBus` 實現自動化步進，Agent 完工後自動觸發下一階段任務
  - Web 控制台新增「長程工作流」監控看板

## [v8.0.0] - 2026-03-01

### Added
- **元進化與動態能力生成 (Meta-Evolution)**
  - 實作 `SkillArchitect` 技能建築師，支援自動生成、修復與安裝新技能
  - 實作 `EvolutionManager` 進化管理器，建立演進審計與回滾機制

## [v7.0.0] - 2026-03-01

### Added
- **外部邊界擴張 (External Boundary Expansion)**
  - 實作 `APIConnector` 與 `WebhookReceiver`，讓 Agent 感知並影響全網
  - 實作 `NotificationCenter`，支援向 Telegram/Slack 推送即時進度
