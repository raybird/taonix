# Taonix v23.1.0

> 事件驅動的多智能體 AI 作業系統 — 為 TeleNexus 而生

Taonix（道之樞紐，Tao + Nexus）是一個以 **EventBus 編舞式協作**為核心的多智能體框架。Agent 之間不直接呼叫，而是透過型別化事件通訊；共享 **Blackboard** 維護全域推理狀態；所有技能在 **沙盒化 Skill 系統**中安全執行。對外僅暴露單一 MCP 工具 `taonix_hub`，接收自然語言意圖後自動調度 9 位專家 Agent 完成任務。

## 快速開始

### 系統需求

- **Node.js v22+**（ESM 模組，不支援 CommonJS）

### 安裝

```bash
git clone <repo-url> taonix
cd taonix
npm install
```

`npm install` 會自動透過 `postinstall` 安裝 `mcp-server/` 的外部依賴（`@modelcontextprotocol/sdk`）。其餘子模組為零外部依賴。

### 啟動 MCP Server

```bash
node mcp-server/index.js
```

### MCP Client 設定

將以下 JSON 加入你的 MCP Client 設定檔（Claude Desktop / Cursor / 其他 MCP Client）：

```json
{
  "mcpServers": {
    "taonix": {
      "command": "node",
      "args": ["/path/to/taonix/mcp-server/index.js"]
    }
  }
}
```

> 將 `/path/to/taonix` 替換為你的實際路徑。

### AI Engine 獨立使用

```bash
node ai-engine/index.js "幫我分析這個專案的架構"
```

### Web 控制台

```bash
node web-console/server.js
# 開啟 http://localhost:3000
```

### 執行測試

```bash
node tests/test-integration.js
```

## 目錄結構

```
taonix/
├── agents/                  # Agent CLI 工具
│   ├── explorer/            # 滄溟 — 搜尋與趨勢探索
│   ├── coder/               # 鑄焰 — 程式實作與檔案操作
│   ├── oracle/              # 明鏡 — 架構分析與深度推理
│   ├── reviewer/            # 守闕 — 程式審查與品質把關
│   ├── designer/            # 天工 — 創意設計與 UX
│   ├── product/             # 鴻圖 — 產品規劃與需求分析
│   ├── tester/              # 試煉 — 測試自動化
│   ├── assistant/           # 助理 — 跨 Agent 協調與排程
│   ├── lib/                 # 共用 Agent 基底
│   ├── registry.js          # Agent 註冊機制
│   ├── consensus-engine.js  # 共識引擎
│   └── self-healing-agent.js # 自癒者 — 系統診斷與修復
├── ai-engine/               # 核心 AI 引擎
│   ├── index.js             # TaonixAI 主類別
│   └── lib/                 # 意圖理解、Agent 調度、事件匯流排等
├── config/                  # 路徑管理與系統設定
├── docs/                    # 技術文件
├── integration/             # TeleNexus 整合
├── mcp-server/              # MCP Server 統一入口
├── memory/                  # Blackboard 共享記憶
├── party/                   # 多 Agent 組隊協作
├── planning/                # 規劃引擎
├── skills/                  # 技能框架（13 個內建技能）
├── tests/                   # 整合測試
├── tools/                   # 內部工具模組
└── web-console/             # Web 控制台
```

## Agent 團隊

### 核心開發小隊

| Agent | 代號 | 職責 |
|-------|------|------|
| Explorer | 滄溟 | 搜尋資訊、趨勢追蹤、網頁擷取 |
| Coder | 鑄焰 | 程式實作、代碼重構、檔案操作 |
| Oracle | 明鏡 | 架構分析、依賴檢查、深度推理 |
| Reviewer | 守闕 | 代碼審查、格式檢查、品質把關 |
| Designer | 天工 | 創意設計、UX 流程、介面原型 |
| Product | 鴻圖 | 產品規劃、需求分析、優先級排序 |

### 測試與自動化

| Agent | 代號 | 職責 |
|-------|------|------|
| Tester | 試煉 | 測試案例生成、自動化測試執行 |

### 指揮與管理層

| Agent | 代號 | 職責 |
|-------|------|------|
| Assistant | 助理 | 任務規劃、跨 Agent 協調、排程 |

### 系統角色

| 角色 | 職責 |
|------|------|
| Self-Healer（自癒者） | 系統健康監控、環境異常修復 |
| Arbitrator（仲裁者） | 衝突解決、根因分析、決策支援 |
| Skill Architect（建築師） | 技能編寫、自我演進、能力擴充 |

## 技能清單

| 技能 | 說明 |
|------|------|
| agent-coordinator | 跨 Agent 協調與任務路由 |
| brainstorming | 創意發想與腦力激盪 |
| doc-generator | 文件自動生成 |
| executing-plans | 執行實作計劃 |
| performance-optimization | 效能分析與優化 |
| receiving-code-review | 接收審查建議並改進 |
| remote-example | 遠端操作範例 |
| requesting-code-review | 發起程式碼審查 |
| security-audit | 安全性稽核 |
| systematic-debugging | 四階段系統化除錯 |
| test-driven-development | 測試驅動開發 |
| verification-before-completion | 完成前品質驗證 |
| writing-plans | 撰寫實作計劃 |

## 架構概覽

### 處理管線

```
使用者意圖 → MCP Hub (taonix_hub) → 意圖理解 → Agent 調度器 → Skill 匹配器 → 內容生成 → 回應
```

### 核心基礎設施

- **EventBus**（`ai-engine/lib/event-bus.js`）— 所有跨 Agent 通訊皆透過型別化 pub/sub 事件，禁止直接呼叫
- **Blackboard**（`memory/blackboard.js`）— 共享全域狀態，包含事實牆、推理鏈與假說
- **Skill 系統**（`skills/`）— 情境感知匹配與沙盒化執行，缺失技能自動生成
- **共識機制**（`agents/consensus-engine.js`）— Gossip 協議跨節點事實同步
- **情境恢復**（`ai-engine/lib/context-recovery.js`）— 崩潰復原與跨節點熱遷移
- **成就系統**（`ai-engine/lib/achievement-system.js`）— 榮譽勳章驅動 15-20% 調度權重加成

## 環境變數

| 變數 | 說明 | 預設值 |
|------|------|--------|
| `TAONIX_DATA_DIR` | 資料存放根目錄 | 專案目錄 |

詳見 [`.env.example`](.env.example)。

## 相關文件

| 文件 | 說明 |
|------|------|
| [docs/README.md](docs/README.md) | 技術深潛指南（API 參考、模組詳解） |
| [docs/AGENTS.md](docs/AGENTS.md) | Agent 團隊完整手冊 |
| [docs/CHANGELOG.md](docs/CHANGELOG.md) | 版本變更紀錄 |
| [docs/ROADMAP.md](docs/ROADMAP.md) | 功能路線圖 |
| [docs/SOP.md](docs/SOP.md) | 標準作業程序 |
| [SOUL.md](SOUL.md) | 系統哲學與角色定位 |
| [CLAUDE.md](CLAUDE.md) | Claude Code 開發指引 |

## License

MIT
