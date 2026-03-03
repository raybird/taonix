# CLAUDE.md

本文件為 Claude Code (claude.ai/code) 在此專案中運作時的指引。

## 專案概覽

Taonix（道之樞紐，"Tao + Nexus"）是一個事件驅動的多智能體 AI 作業系統，為 TeleNexus 而生。透過編舞式協作（非命令控制），以 EventBus 進行通訊、共享 Blackboard 維護狀態、沙盒化 Skill 系統實現可擴展性。

**執行環境**：Node.js v22+，僅使用 ESM 模組（禁止 CommonJS）。

## 常用指令

```bash
# 啟動 MCP 伺服器（主要整合入口，對外暴露單一 `taonix_hub` 工具）
node mcp-server/index.js

# 單獨執行 AI 引擎
node ai-engine/index.js "你的意圖指令"

# 執行整合測試（驗證 Oracle、Reviewer、Blackboard 聯動）
node tests/test-integration.js

# 執行單一 Agent 測試
cd agents/coder && node --test test.js

# 啟動 Web 控制台（port 3000）
node web-console/server.js

# 監控即時事件串流
node agents/assistant/index.js monitor

# 安裝依賴（各子套件各自擁有 package.json）
cd ai-engine && npm install
cd mcp-server && npm install
cd agents/explorer && npm install
# 依此類推
```

## 架構

### 處理管線

使用者意圖的流經路徑：**MCP Hub**（`taonix_hub` 工具）→ **意圖理解** → **Agent 調度器** → **Skill 匹配器** → **內容生成** → 回應。

- `mcp-server/index.js` — 統一 MCP 入口；接收自然語言，路由至對應 Agent
- `ai-engine/index.js` — 核心 `TaonixAI` 類別：`init()` 載入技能，`process(input)` 執行完整管線
- `ai-engine/lib/intent-understanding.js` — 關鍵字模式比對，將意圖映射至 Agent
- `ai-engine/lib/agent-dispatcher.js` — 將已調度的任務路由至 Agent CLI/RPC 端點

### Agent 系統

Agent 位於 `agents/`，各自擁有獨立的 CLI 進入點。主要角色：
- **Explorer**（滄溟）— 搜尋、趨勢探索、網頁爬取
- **Coder**（鑄焰）— 程式實作、檔案操作
- **Oracle**（明鏡）— 架構分析、深度推理
- **Reviewer**（守闕）— 程式審查、品質把關
- **Designer**（天工）— 創意設計與 UX
- **Tester**（試煉）— 測試自動化
- **Assistant** — 跨 Agent 協調、排程、記憶查詢
- **Self-Healer**（`agents/self-healing-agent.js`）— 系統診斷與自動修復

共用 Agent 基底：`agents/lib/base-agent.js`。註冊機制：`agents/registry.js`。

### 核心基礎設施

- **EventBus**（`ai-engine/lib/event-bus.js`）— 所有跨 Agent 通訊皆透過型別化的 pub/sub 事件。禁止直接呼叫 Agent。
- **Blackboard**（`memory/blackboard.js`）— 共享全域狀態，包含事實牆、推理鏈與假說。持久化至 `.data/blackboard_state.json`。使用 `blackboard.recordFact()` 與 `blackboard.recordThought()`。
- **Skill 系統**（`skills/`）— 註冊、情境感知匹配、沙盒執行。14+ 個內建技能位於 `skills/agentskills/`。缺失技能由 `skills/skill-architect.js` 自動生成。
- **共識機制**（`agents/consensus-engine.js`、`ai-engine/lib/gossip-consensus.js`）— 基於 Gossip 協議的跨節點事實同步。
- **情境恢復**（`ai-engine/lib/context-recovery.js`）— 崩潰復原與跨節點熱遷移。
- **成就系統**（`ai-engine/lib/achievement-system.js`）— 榮譽勳章驅動 15-20% 的調度權重加成。

### 路徑管理

所有資料路徑集中於 `config/paths.js`。可透過 `TAONIX_DATA_DIR` 環境變數覆寫根目錄。禁止硬編碼路徑。

### 執行期狀態

`.data/` 目錄存放所有執行期狀態：`blackboard_state.json`、`event_logs.jsonl`、`experience_base.json`、`sandbox_audit.jsonl`、`agent_registry.json`、`stats.json`。

## 開發規範

- 所有跨 Agent 通訊必須透過 EventBus（型別化 schema 定義於 `ai-engine/lib/event-schema.js`）
- 關鍵推理過程必須透過 `Blackboard.recordThought(agentName, thought)` 記錄
- 第三方或動態腳本必須透過 `SkillSandbox`（`skills/sandbox.js`）執行
- 程式碼註解與 UI 的主要語言為繁體中文（台灣用語）
- Commit 格式：`feat:` / `fix:` 前綴加描述
- 發布流程：更新 `docs/CHANGELOG.md` → 更新 `README.md` 版本號 → 如有新角色則更新 `docs/AGENTS.md` → commit → tag `vX.Y.Z` → push with tags

## 重要文件

- `SOUL.md` — 系統哲學與 Agent 角色定位
- `docs/AGENTS.md` — Agent 團隊手冊
- `docs/taonix-design.md` — 架構設計規格書
- `docs/SOP.md` — 標準作業程序
- `docs/ROADMAP.md` — 功能路線圖
- `docs/CHANGELOG.md` — 版本變更紀錄
- `MANIFEST.json` — 系統能力與進入點宣告
