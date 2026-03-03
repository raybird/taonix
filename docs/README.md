# Taonix 技術深潛指南

> 本文件為 Taonix 的技術細節參考。快速上手請見[根目錄 README](../README.md)。

## 目錄

- [Agent 團隊](#agent-團隊)
- [技能清單](#技能清單)
- [MCP 工具](#mcp-工具)
- [目錄結構](#目錄結構)
- [AI Engine API](#ai-engine-api)
- [核心模組參考](#核心模組參考)
- [開發歷程](#開發歷程)

---

## Agent 團隊

### 核心開發小隊

| Agent | 代號 | 特質 | 職責 | 能力標籤 |
|-------|------|------|------|----------|
| Explorer | 滄溟 | 活潑好奇 | 搜尋資訊、趨勢追蹤、網頁擷取 | `searching`, `browsing`, `github_trending` |
| Coder | 鑄焰 | 嚴謹務實 | 程式實作、代碼重構、檔案操作、Bug 修復 | `coding`, `refactoring`, `filesystem` |
| Oracle | 明鏡 | 冷靜理性 | 架構分析、依賴檢查、深度邏輯推導 | `analysis`, `architecture`, `reasoning` |
| Reviewer | 守闕 | 毒舌中肯 | 代碼審查、格式檢查、安全性把關 | `code_review`, `security`, `quality_assurance` |
| Designer | 天工 | 美感實用 | 創意設計、UX 流程規劃、介面原型 | `design`, `ux`, `prototyping` |
| Product | 鴻圖 | 策略導向 | 產品規劃、需求分析、優先級排序 | `product_planning`, `requirements`, `prioritization` |

### 測試與自動化

| Agent | 代號 | 職責 | 能力標籤 |
|-------|------|------|----------|
| Tester | 試煉 | 測試案例生成、自動化測試、環境驗證 | `testing`, `validation`, `ci` |

### 指揮與管理層

| Agent | 代號 | 職責 | 能力標籤 |
|-------|------|------|----------|
| Assistant | 助理 | 任務規劃、跨 Agent 協調、長程工作流編排 | `planning`, `coordination`, `summarization` |

### 系統角色

| 角色 | 職責 | 核心機制 |
|------|------|----------|
| Arbitrator（仲裁者） | 衝突解決、根因分析、決策支援 | 監聽任務錯誤並提出修復建議 |
| Skill Architect（建築師） | 技能編寫、自我演進、能力擴充 | 根據需求自動生成新技能 |
| Self-Healer（自癒者） | 系統健康監控、環境異常修復 | SSH 即時修復 + 檔案中轉備援雙軌制 |

---

## 技能清單

Taonix 具備 13 個內建技能，根據意圖上下文自動匹配觸發：

| 技能 | 關鍵字 | 功能 |
|------|--------|------|
| agent-coordinator | 協調、調度 | 跨 Agent 協調與任務路由 |
| brainstorming | 頭腦風暴、想想看 | 創意發想與腦力激盪 |
| doc-generator | 文件、文檔 | 文件自動生成 |
| executing-plans | 執行 | 執行實作計劃 |
| performance-optimization | 效能、優化 | 效能分析與優化建議 |
| receiving-code-review | 審查、回饋 | 接收審查建議並改進 |
| remote-example | 遠端、範例 | 遠端操作範例 |
| requesting-code-review | 請求審查 | 發起程式碼審查 |
| security-audit | 安全、稽核 | 安全性稽核與漏洞掃描 |
| systematic-debugging | bug、除錯、錯誤 | 四階段系統化根因分析 |
| test-driven-development | 測試、TDD | 測試驅動開發流程 |
| verification-before-completion | 驗證、完成 | 完成前品質確認 |
| writing-plans | 規劃、計劃 | 撰寫實作計劃 |

技能定義位於 `skills/agentskills/` 下各子目錄的 `SKILL.md`。缺失技能可由 Skill Architect（`skills/skill-architect.js`）自動生成。

---

## MCP 工具

Taonix 對外暴露**單一 MCP 工具** `taonix_hub`，取代早期版本的多工具架構。

### taonix_hub

接收自然語言意圖，自動執行語義驗證、Agent 調度、技能匹配，並回傳結構化結果。

**inputSchema：**

```json
{
  "type": "object",
  "properties": {
    "intent": {
      "type": "string",
      "description": "任務意圖（自然語言）"
    }
  },
  "required": ["intent"]
}
```

**回傳格式：**

```json
{
  "content": [
    {
      "type": "text",
      "text": "JSON 格式的執行結果"
    }
  ]
}
```

其中 `text` 欄位為 JSON 字串，包含：

| 欄位 | 型別 | 說明 |
|------|------|------|
| `intent` | string | 識別出的意圖類型 |
| `userInput` | string | 原始使用者輸入 |
| `agent` | object | 主要執行 Agent 資訊 |
| `content` | string | 生成的回應內容 |
| `skill` | string \| null | 觸發的技能名稱 |
| `skillGuidance` | object \| null | 技能指導內容 |
| `agents` | array | 所有參與的 Agent 清單 |

### 意圖分派範例

| 意圖 | 自動分派 Agent | 觸發技能 |
|------|----------------|----------|
| 「幫我看最近 Python 有什麼好玩的」 | Explorer（滄溟） | — |
| 「分析這個專案的架構」 | Oracle（明鏡） | — |
| 「幫我寫一個排序演算法」 | Coder（鑄焰） | — |
| 「審查這段程式碼」 | Reviewer（守闕） | requesting-code-review |
| 「這個 bug 怎麼修」 | Coder（鑄焰） | systematic-debugging |
| 「幫我規劃開發計劃」 | Assistant（助理） | writing-plans |

---

## 目錄結構

```
taonix/
├── agents/                     # Agent CLI 工具
│   ├── explorer/               # 滄溟 — 搜尋與趨勢探索
│   ├── coder/                  # 鑄焰 — 程式實作與檔案操作
│   ├── oracle/                 # 明鏡 — 架構分析與深度推理
│   ├── reviewer/               # 守闕 — 程式審查與品質把關
│   ├── designer/               # 天工 — 創意設計與 UX
│   ├── product/                # 鴻圖 — 產品規劃與需求分析
│   ├── tester/                 # 試煉 — 測試自動化
│   ├── assistant/              # 助理 — 跨 Agent 協調與排程
│   ├── lib/                    # 共用 Agent 基底 (base-agent.js)
│   ├── registry.js             # Agent 註冊機制
│   ├── consensus-engine.js     # Gossip 共識引擎
│   ├── self-healing-agent.js   # 自癒者
│   ├── squad-debriefing.js     # 小隊復盤
│   └── init-core-registration.js # 核心 Agent 啟動註冊
├── ai-engine/                  # 核心 AI 引擎
│   ├── index.js                # TaonixAI 主類別
│   └── lib/
│       ├── intent-understanding.js  # 意圖理解
│       ├── agent-dispatch.js        # Agent 調度
│       ├── agent-dispatcher.js      # Agent RPC 調度器
│       ├── content-generation.js    # 內容生成
│       ├── event-bus.js             # EventBus 事件匯流排
│       ├── event-schema.js          # 型別化事件 Schema
│       ├── context-recovery.js      # 情境恢復與熱遷移
│       ├── achievement-system.js    # 成就與榮譽系統
│       ├── gossip-consensus.js      # Gossip 共識協議
│       ├── health-check.js          # 健康檢查
│       ├── task-state-machine.js    # 任務狀態機
│       ├── ai-caller.js            # AI 模型呼叫器
│       └── semantic-validator.js    # 語義預審驗證
├── config/
│   └── paths.js                # 統一路徑管理
├── memory/
│   ├── blackboard.js           # Blackboard 共享記憶
│   ├── learning.js             # 自我學習模組
│   ├── preference-store.js     # 使用者偏好儲存
│   └── intent-library.js       # 意圖庫
├── planning/
│   └── planning-engine.js      # 規劃引擎
├── party/
│   └── party-coordinator.js    # 多 Agent 組隊協作
├── skills/
│   ├── index.js                # 技能引擎入口
│   ├── matcher.js              # 情境感知匹配器
│   ├── sandbox.js              # 沙盒化執行環境
│   ├── skill-architect.js      # 技能自動生成
│   ├── evolution-manager.js    # 演進管理器
│   ├── policy-manager.js       # 政策管理器
│   └── agentskills/            # 13 個內建技能
├── mcp-server/
│   └── index.js                # MCP Server (taonix_hub)
├── integration/                # TeleNexus 整合
├── tests/
│   └── test-integration.js     # 整合測試
├── tools/                      # 內部工具模組
├── web-console/
│   └── server.js               # Web 控制台 (port 3000)
└── .data/                      # 執行期狀態（gitignore）
```

---

## AI Engine API

### 基本用法

```javascript
import { TaonixAI, run, getSkills, getLearningStats } from "./ai-engine/index.js";

// 方式一：快捷函式
const result = await run("幫我分析這個專案的架構");

// 方式二：類別實例
const ai = new TaonixAI();
await ai.init();
const result = await ai.process("你的指令");

// 取得技能清單
const skills = await getSkills();

// 取得學習統計
const stats = await getLearningStats();
```

### 回傳結構

```javascript
{
  intent: "code_analysis",        // 識別出的意圖類型
  userInput: "你的指令",           // 原始輸入
  agent: {                        // 主要執行 Agent
    agent: "oracle",
    name: "明鏡",
    // ...
  },
  content: "...",                 // 生成的回應內容
  skill: "systematic-debugging",  // 觸發的技能（null 表示未觸發）
  skillGuidance: { ... },        // 技能指導內容
  agents: [...]                  // 所有參與的 Agent 清單
}
```

---

## 核心模組參考

### EventBus（`ai-engine/lib/event-bus.js`）

所有跨 Agent 通訊皆透過 EventBus 型別化事件。事件 Schema 定義於 `ai-engine/lib/event-schema.js`。

```javascript
import { eventBus } from "../ai-engine/lib/event-bus.js";

eventBus.emit("task:assigned", { agent: "coder", task: "..." });
eventBus.on("task:completed", (data) => { /* ... */ });
```

### Blackboard（`memory/blackboard.js`）

共享全域狀態，包含事實牆、推理鏈與假說。持久化至 `.data/blackboard_state.json`。

```javascript
import { blackboard } from "../memory/blackboard.js";

blackboard.recordFact("discovery", { key: "value" });
blackboard.recordThought("oracle", "這個架構需要重構");
```

### Skill Sandbox（`skills/sandbox.js`）

所有第三方或動態腳本必須透過沙盒執行，審計紀錄寫入 `.data/sandbox_audit.jsonl`。

### Gossip Consensus（`ai-engine/lib/gossip-consensus.js`）

基於 Gossip 協議的跨節點事實同步，支援 Revision ID 校驗與增量指紋壓縮。

### Context Recovery（`ai-engine/lib/context-recovery.js`）

崩潰復原與跨節點熱遷移（v23.0.0），當單一節點故障時自動移交至健康節點。

### Achievement System（`ai-engine/lib/achievement-system.js`）

榮譽勳章驅動 15-20% 調度權重加成，高榮譽 Agent 可提交系統優化提案。

---

## 開發歷程

| 階段 | 版本 | 里程碑 |
|------|------|--------|
| CLI 框架 | v1-v3 | 4 個 Agent CLI 工具 |
| MCP 封裝 | v4-v6 | MCP Server 包裝、TeleNexus 整合 |
| AI 引擎 | v7-v9 | 意圖理解、Agent 調度、內容生成 |
| 自主進化 | v10-v13 | 技能框架、自我學習、沙盒化執行 |
| 架構強化 | v14-v18 | EventBus、Blackboard、路徑管理、語義對齊 |
| 榮譽與共識 | v19-v23 | 成就系統、Gossip 共識、熱遷移、全球心智 |

詳見 [CHANGELOG.md](./CHANGELOG.md) 與 [ROADMAP.md](./ROADMAP.md)。

---

## 技術棧

- **Node.js v22+**（ESM 模組）
- **@modelcontextprotocol/sdk**（MCP 協議）
- **JSON**（標準化輸出格式）

---

## License

MIT
