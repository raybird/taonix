# Taonix

> 基於 Tao of Coding 框架的多智能體協作系統

## 概述

Taonix (Taonix = Tao + Nexus，道之樞紐) 是一個賦予 TeleNexus 擁有多个 Sub-Agent 來協助完成任務的多智能體系統。

## 特性

- **多 Agent 協作** - 4+1 種專家 Agent，分工明確
- **CLI 獨立運作** - 每個 Agent 可單獨使用
- **MCP Server 整合** - 統一入口，被 TeleNexus 調用
- **技能框架** - 8 個專業技能，自動匹配
- **自我學習** - 記住使用者偏好與統計數據

## 專案結構

```
taonix/
├── agents/           # Agent CLI 工具（4個）
│   ├── explorer/    # 搜尋、爬蟲 Agent
│   ├── coder/       # 程式開發 Agent
│   ├── oracle/      # 架構分析 Agent
│   └── reviewer/    # 程式碼審查 Agent
├── mcp-server/      # MCP Server (13 tools, port 3916)
├── ai-engine/       # AI 調度引擎（意圖理解、Agent 分配）
├── skills/          # 技能框架
│   ├── registry.js  # 技能註冊
│   ├── matcher.js   # 技能匹配
│   └── skills/      # 8 個專業技能
├── memory/          # 自我學習模組
├── integration/     # TeleNexus 整合
└── docs/            # 設計文件
```

## Agent 團隊

| Agent    | 名字 | 風格     | 功能                      |
| -------- | ---- | -------- | ------------------------- |
| Explorer | 小探 | 活潑好奇 | 搜尋、爬蟲、網頁擷取      |
| Coder    | 小碼 | 嚴謹務實 | 讀寫檔案、執行指令、Debug |
| Oracle   | 小析 | 冷靜理性 | 架構分析、依賴分析        |
| Reviewer | 把關 | 毒舌中肯 | 品質檢查、格式檢查        |

## 技能框架

| 技能                           | 關鍵字           |
| ------------------------------ | ---------------- |
| Brainstorming                  | 發想、討論、想法 |
| Systematic Debugging           | bug、除錯、錯誤  |
| Test-Driven Development        | 測試、test       |
| Receiving Code Review          | 審查、review     |
| Requesting Code Review         | 求審查           |
| Writing Plans                  | 規劃、計劃       |
| Executing Plans                | 執行             |
| Verification Before Completion | 驗證、確認       |

## 快速開始

### 安裝

```bash
cd taonix
npm install
```

### 使用 CLI

```bash
# Explorer - 搜尋網頁
cd agents/explorer
node index.js github-trending --language javascript

# Coder - 讀寫檔案
cd agents/coder
node index.js ls ../explorer

# Oracle - 架構分析
cd agents/oracle
node index.js structure ../

# Reviewer - 品質檢查
cd agents/reviewer
node index.js quality ../../projects/taonix/agents/explorer/index.js
```

### 啟動 MCP Server

```bash
cd mcp-server
node index.js
# Server 運行於 http://localhost:3916
```

### API 端點

| Method | Path        | 說明           |
| ------ | ----------- | -------------- |
| POST   | /v1/execute | 執行 Agent     |
| GET    | /v1/agents  | 列出所有 Agent |
| GET    | /v1/health  | 健康檢查       |

## 開發歷程

| 版本   | 內容                                             |
| ------ | ------------------------------------------------ |
| v1.0.0 | 初始版本：4 Agent CLI + MCP Server + Skills Core |

## 技術栈

- Node.js (ESM)
- Commander.js (CLI)
- @modelcontextprotocol/sdk (MCP)
- JSON (標準化輸出)

## License

MIT
