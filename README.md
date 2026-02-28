# Taonix

> 基於 Tao of Coding 框架的多智能體協作系統

## 概述

Taonix (Taonix = Tao + Nexus，道之樞紐) 是一個賦予 TeleNexus 擁有多个 Sub-Agent 來協助完成任務的多智能體系統。

## 特性

- **多 Agent 協作** - 8 種專家 Agent，分工明確
- **CLI 獨立運作** - 每個 Agent 可單獨使用
- **MCP Server 整合** - 統一入口，被 TeleNexus 調用
- **技能框架** - 11 個專業技能，自動匹配
- **技能市場** - 支援第三方技能擴展
- **自我學習** - 記住使用者偏好與統計數據
- **Party Mode** - 多 Agent 並行協作
- **Web 控制台** - 圖形化監控面板
- **長期規劃** - 子目標分解與追蹤
- **主動式建議** - 智慧建議系統

## 專案結構

```
taonix/
├── agents/           # Agent CLI 工具（7個）
├── mcp-server/       # MCP Server (13 tools)
├── # AI 調度引擎
├── skills/           # ai-engine/        技能框架 + 市場
├── memory/           # 自我學習模組
├── party/            # Party Mode
├── web-console/      # Web 控制台
└── docs/             # 設計文件
```

## Agent 團隊

| Agent    | 名字 | 風格     | 功能                      |
| -------- | ---- | -------- | ------------------------- |
| Explorer | 滄溟 | 活潑好奇 | 搜尋、爬蟲、網頁擷取      |
| Coder    | 鑄焰 | 嚴謹務實 | 讀寫檔案、執行指令、Debug |
| Oracle   | 明鏡 | 冷靜理性 | 架構分析、依賴分析        |
| Reviewer | 守闕 | 毒舌中肯 | 品質檢查、格式檢查        |
| Designer | 天工 | 創意美觀 | UI/UX 設計、元件生成      |
| Product  | 鴻圖 | 邏輯清晰 | 產品規劃、需求分析        |
| Tester   | 試煉 | 細心嚴謹 | 測試生成、測試計劃        |

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

### Party Mode 狀態儀表板

```bash
# 查看儀表板
node party/cli.js status

# 查看所有會話
node party/cli.js sessions

# 清除所有會話
node party/cli.js clear
```

### 技能市場

```bash
# 列出所有技能
node skills/marketplace/cli.js list

# 安裝技能
node skills/marketplace/cli.js install <name>

# 移除技能
node skills/marketplace/cli.js remove <name>
```

### Web 控制台

```bash
# 啟動 Web 控制台
node web-console/server.js
# 訪問 http://localhost:3000
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
| v3.7.0 | AI Caller - 雙層 Router 最後一環             |
| v3.6.0 | 雙層 Router - 統一 MCP 入口                  |
| v3.5.0 | 靈魂文件 - 定義使命與身分                    |
| v1.3.0 | 生態擴展 - 技能市場 + Web 控制台                 |
| v1.2.0 | 生態擴展 - 更多領域 Agent                        |
| v1.1.0 | Party Mode - 狀態儀表板                          |
| v1.0.0 | 初始版本：4 Agent CLI + MCP Server + Skills Core |

## 技術栈

- Node.js (ESM)
- Commander.js (CLI)
- @modelcontextprotocol/sdk (MCP)
- JSON (標準化輸出)

## License

MIT
