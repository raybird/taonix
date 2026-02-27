# Taonix

> 基於 Tao of Coding 框架的多智能體協作系統

## 概述

Taonix (Taonix = Tao + Nexus，道之樞紐) 是一個賦予 TeleNexus 擁有多个 Sub-Agent 來協助完成任務的多智能體系統。

## 專案結構

```
taonix/
├── agents/           # Agent CLI 工具
│   ├── explorer/     # 搜尋、爬蟲 Agent
│   ├── coder/       # 程式開發 Agent
│   ├── oracle/      # 架構分析 Agent
│   └── reviewer/    # 程式碼審查 Agent
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

### MCP Server

```bash
cd mcp-server
node index.js
```

## 開發歷程

- **第一階段 (CLI)** - 4 個 Agent CLI 框架
- **第二階段 (MCP)** - MCP Server 包裝
- **第三階段 (整合)** - TeleNexus 整合

## 技術栈

- Node.js (ESM)
- Commander.js (CLI)
- @modelcontextprotocol/sdk (MCP)
- JSON (標準化輸出)

## License

MIT
