# Taonix

> 基於 Tao of Coding 框架的多智能體協作系統

## 概述

Taonix (Taonix = Tao + Nexus，道之樞紐) 是一個賦予 TeleNexus 擁有多个 Sub-Agent 來協助完成任務的多智能體系統。

## 核心特性

- **多 Agent 協作** - 4 個專業 Agent 分工合作
- **AI 意圖理解** - 自動理解使用者模糊指令
- **技能框架** - 8 個專業技能自動觸發
- **自我學習** - 記住使用者偏好持續優化
- **MCP 整合** - 標準化 MCP 協定介面

## 專案結構

```
taonix/
├── agents/           # Agent CLI 工具
│   ├── explorer/     # 搜尋、爬蟲 Agent
│   ├── coder/       # 程式開發 Agent
│   ├── oracle/      # 架構分析 Agent
│   └── reviewer/    # 程式碼審查 Agent
├── ai-engine/       # AI Engine (意圖理解、Agent 調度、內容生成)
├── skills/          # 技能框架核心 (8 個技能自動觸發)
│   └── skills/      # 技能實作
├── memory/          # 自我學習模組
├── mcp-server/      # MCP Server (13 tools)
├── integration/     # TeleNexus 整合
│   ├── client.js
│   ├── agents.js
│   └── telenexus-config.json
└── docs/            # 文件
```

## Agent 團隊

| Agent    | 名字 | 風格     | 功能                      |
| -------- | ---- | -------- | ------------------------- |
| Explorer | 小探 | 活潑好奇 | 搜尋、爬蟲、網頁擷取      |
| Coder    | 小碼 | 嚴謹務實 | 讀寫檔案、執行指令、Debug |
| Oracle   | 小析 | 冷靜理性 | 架構分析、依賴分析        |
| Reviewer | 把關 | 毒舌中肯 | 品質檢查、格式檢查        |

## 快速開始

### 安裝

```bash
cd taonix
cd agents/explorer && npm install
cd ../coder && npm install
cd ../oracle && npm install
cd ../reviewer && npm install
cd ../mcp-server && npm install
cd ../ai-engine && npm install
```

### 使用 CLI

```bash
# Explorer
cd agents/explorer
node index.js github-trending --language javascript

# Coder
cd agents/coder
node index.js ls ../explorer

# Oracle
cd agents/oracle
node index.js structure ../

# Reviewer
cd agents/reviewer
node index.js quality ../../projects/taonix/agents/explorer/index.js
```

### 使用 AI Engine

```bash
cd ai-engine
node index.js "帮我看看最近 python 有什么好玩的"
```

### MCP Server

```bash
cd mcp-server
node index.js
```

---

## AI Engine 使用

### 程式碼使用

```javascript
import { run, getSkills, getLearningStats } from "./ai-engine/index.js";

// 處理輸入
const result = await run("帮我看看最近 python 有什么好玩的");
console.log(result);

// 取得技能清單
const skills = await getSkills();

// 取得學習統計
const stats = await getLearningStats();
```

### 輸入範例

| 輸入                             | 觸發 Agent        | 意圖            |
| -------------------------------- | ----------------- | --------------- |
| 帮我看看最近 python 有什么好玩的 | Explorer          | github_trending |
| 帮我分析这个项目的代码质量       | Oracle + Reviewer | code_analysis   |
| 帮我写一个排序算法               | Coder             | code_generation |

---

## 技能框架

Taonix 具備 8 個專業技能，根據輸入自動觸發：

| 技能                           | 關鍵字           | 功能           |
| ------------------------------ | ---------------- | -------------- |
| brainstorming                  | 頭腦風暴、想想看 | 創意發想       |
| systematic-debugging           | bug、除錯、錯誤  | 4 階段根因分析 |
| test-driven-development        | 測試、TDD        | 測試驅動開發   |
| receiving-code-review          | 審查、回饋       | 接收審查建議   |
| requesting-code-review         | 請求審查         | 發起程式碼審查 |
| writing-plans                  | 規劃、計劃       | 撰寫實作計劃   |
| executing-plans                | 執行             | 執行實作計劃   |
| verification-before-completion | 驗證、完成       | 完成前品質確認 |

---

## 開發歷程

- **第一階段 (CLI)** - 4 個 Agent CLI 框架
- **第二階段 (MCP)** - MCP Server 包裝
- **第三階段 (整合)** - TeleNexus 整合
- **第四階段 (AI Engine)** - 意圖理解、Agent 調度
- **第五階段 (自主進化 v1)** - 技能框架核心、8 個技能自動觸發、自我學習

## 技術栈

- Node.js (ESM)
- Commander.js (CLI)
- @modelcontextprotocol/sdk (MCP)
- JSON (標準化輸出)

---

## API 參考

### AI Engine

```javascript
// 建立實例
const ai = new TaonixAI();
await ai.init();

// 處理輸入
const result = await ai.process('你的指令');

// 回傳格式
{
  intent: 'github_trending',
  userInput: '你的指令',
  agent: { agent: 'explorer', name: '小探', ... },
  content: '...',
  skill: 'brainstorming',      // 如果觸發技能
  skillGuidance: { ... },       // 技能指導
  agents: [...]                 // 參與的 Agent 清單
}
```

### MCP Tools

| Tool                 | 說明                 |
| -------------------- | -------------------- |
| github_trending      | 取得 GitHub Trending |
| web_search           | 搜尋網頁             |
| read_file            | 讀取檔案             |
| write_file           | 寫入檔案             |
| run_command          | 執行指令             |
| code_review          | 程式碼審查           |
| analyze_structure    | 結構分析             |
| analyze_dependencies | 依賴分析             |

---

## License

MIT
