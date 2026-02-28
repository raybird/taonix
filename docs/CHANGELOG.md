# Changelog

All notable changes to Taonix will be documented in this file.

## [v6.0.0] - 2026-03-01

### Added
- **集體智慧與自適應演進 (Collective Intelligence & Adaptive Evolution)**
  - 實作 `ExperienceBase` 集體經驗庫，持久化紀錄所有小隊協作的歷史數據與效能指標
  - 實作 `AutoScorer` 自動評分系統，基於任務成敗自動進行績效考核
  - 實作 `SquadDebriefing` 後驗總結器，自動從推理鏈路中提取成功關鍵與改進建議
  - 優化 `SquadAssembler` 組建策略，支援基於歷史得分的「最優專家」動態選員
  - Web 控制台新增「Agent 英雄榜」，視覺化呈現各成員的成功率與平均評分

## [v4.5.0] - 2026-03-01

### Added
- **沙盒化動態執行 (Sandboxed Execution)** - 提升擴充安全性
  - 實作 `SkillSandbox` 隔離執行環境，保護主系統免受不可信腳本侵害
  - 建立 `PolicyManager` 權限策略中心，支援動態授予技能 FS/Network 權限
  - 整合至 `SkillEngine` 執行鏈路，強制所有動態載入技能經由沙盒執行
  - Web 控制台新增「安全審計」面板，即時監控執行狀態與攔截紀錄

## [v4.4.0] - 2026-03-01

### Added
- **自動仲裁與決策支援 (Arbitration & Conflict Resolution)** - 提升系統魯棒性
  - 實作 `Arbitrator` 模組，自動監聽 `TASK_ERROR` 並進行 AI 根因分析
  - 建立 `Human-in-the-loop` 介入機制，支援主動向使用者發起決策請求
  - Web 控制台新增「仲裁與衝突解決」面板，視覺化呈現待處理決策
  - 通過端到端仲裁鏈路驗證，實現從錯誤發現到解決建議的完整自動化

## [v4.3.0] - 2026-03-01

### Added
- **環境閉環強化 (Environment Loop)** - 建立 Agent 與真實環境的連動
  - 實作 `GitObserver` 監控工具，自動偵測倉庫變動並廣播事件
  - 實作 `Reactive Tester`，自動對代碼變動執行真實驗證並回報黑板
  - 實作 `Environment Runner`，提供安全的真實指令執行與輸出擷取
  - Web 控制台新增「環境與 CI 監控」區塊，即時呈現 Repo 健康狀態

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
... (下略舊版紀錄)
