# Changelog

All notable changes to Taonix will be documented in this file.

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

... (下略舊版紀錄)
