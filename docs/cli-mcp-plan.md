# CLI-MCP Agent 實作規劃

## 目標

分階段將 Agent 從 CLI 工具轉換為 MCP Server

## 現有資源盤點

### CLI 工具 (已存在)

1. **github-trending** (`projects/github-trending/`)
   - 爬取 GitHub Trending 資訊
   - Node.js ESM 模組
2. **crypto-monitor** (`projects/crypto-monitor/`)
   - 監控加密貨幣價格
   - Node.js ESM 模組

### 腳本

- `scripts/get_btc_report.py`
- `scripts/run_crypto_monitor.sh`
- `scripts/run_github_trending_api.sh`

---

## 第一階段：CLI 框架開發

### 1.1 建立 Agent CLI 基礎結構

```
taonix/
├── agents/
│   ├── explorer/      # 搜尋、爬蟲 Agent
│   ├── oracle/        # 架構分析 Agent
│   ├── coder/         # 程式開發 Agent
│   └── reviewer/      # 程式碼審查 Agent
└── cli/               # CLI 入口
```

### 1.2 每個 Agent CLI 需具備

- 標準 CLI 介面 (commander.js / yargs)
- 獨立執行能力
- 標準化輸出格式 (JSON)
- 錯誤處理與 logging

### 1.3 優先開發順序

1. **Explorer Agent** - 參考 github-trending，改造成 Agent CLI
2. **Coder Agent** - 基於現有程式碼能力封裝
3. **Oracle Agent** - 程式碼分析能力
4. **Review Agent** - Code Review 能力

---

## 第二階段：MCP 包裝

### 2.1 MCP Server 架構

- 每個 Agent CLI 包裝為獨立 MCP Tool
- 統一入口 server (`mcp-server/`)
- 標準化 tool schema

### 2.2 MCP 工具定義範例

```json
{
  "name": "github_trending",
  "description": "取得 GitHub Trending 專案",
  "inputSchema": {
    "type": "object",
    "properties": {
      "language": { "type": "string" }
    }
  }
}
```

---

## 第三階段：TeleNexus 整合

### 3.1 註冊到 TeleNexus

- 在 config 中註冊 MCP Server
- 建立 tool mapping

### 3.2 測試驗證

- 單一 Agent 測試
- 多 Agent 協作測試

---

## 排程追蹤

- [x] 排程建立 (ID: 32) - 每 30 分鐘執行
- [x] 第一階段啟動 - 2026/2/27 確認開始
- [x] Explorer Agent CLI 框架建置 - 已完成
- [x] Coder Agent CLI 框架建置 - 已完成
- [x] Oracle Agent CLI 框架建置 - 已完成
- [x] Reviewer Agent CLI 框架建置 - 已完成
- [x] 第二階段：MCP 包裝 - 已完成
- [x] 第三階段：TeleNexus 整合 - 已完成

---

## 第四階段：AI Engine

### 4.1 實現功能

- **意圖理解** - 解析中文指令 → 意圖 + 參數
- **Agent 調度** - 根據意圖分配正確的 Agent
- **內容生成** - 生成結構化回覆模板

### 4.2 排程追蹤

- [x] AI Engine 開發 - 已完成

---

## 第五階段：自主進化 v1

### 5.1 實現功能

- **技能框架核心** - 8 個技能自動觸發
- **技能匹配引擎** - 根據輸入關鍵字自動選擇正確技能
- **自我學習模組** - 記住使用者偏好與統計數據

### 5.2 排程追蹤

- [x] 技能框架核心建置 - 已完成
- [x] 技能匹配引擎建置 - 已完成
- [x] 自我學習模組建置 - 已完成
      SOP 文件對- [x]齊 - 已完成
