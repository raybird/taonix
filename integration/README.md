# Taonix TeleNexus 整合

## 概述

第三階段將 Taonix MCP Server 整合到 TeleNexus 系統。

## 目錄結構

```
taonix/
├── agents/           # Agent CLI 工具
├── mcp-server/      # MCP Server
├── integration/     # TeleNexus 整合
│   ├── client.js     # MCP Client
│   ├── agents.js     # Agent 封裝
│   └── telenexus-config.json
└── docs/            # 文件
```

## 快速開始

### 1. 啟動 MCP Server

```bash
cd mcp-server
npm install
node index.js
```

### 2. 在 TeleNexus 中註冊

在 TeleNexus config 中新增：

```json
{
  "mcpServers": {
    "taonix": {
      "command": "node",
      "args": ["./taonix/mcp-server/index.js"]
    }
  }
}
```

### 3. 使用 Agent 工具

| Agent | 工具                                                          |
| ----- | ------------------------------------------------------------- |
| 滄溟  | github_trending, web_search                                   |
| 鑄焰  | read_file, write_file, list_files, run_command, code_review   |
| 明鏡  | analyze_structure, analyze_dependencies, suggest_architecture |
| 守闕  | check_quality, check_format, check_logic                      |

## 工具對應

### Explorer (滄溟)

- `explorer_github_trending` - 取得 GitHub Trending
- `explorer_web_search` - 網頁搜尋

### Coder (鑄焰)

- `coder_read_file` - 讀取檔案
- `coder_write_file` - 寫入檔案
- `coder_list_files` - 列出檔案
- `coder_run_command` - 執行指令
- `coder_code_review` - Code Review

### Oracle (明鏡)

- `oracle_analyze_structure` - 分析結構
- `oracle_analyze_dependencies` - 分析依賴
- `oracle_suggest_architecture` - 架構建議

### Reviewer (把關)

- `reviewer_check_quality` - 品質檢查
- `reviewer_check_format` - 格式檢查
- `reviewer_check_logic` - 邏輯檢查

## 整合狀態

- [x] MCP Server 開發
- [x] Client 封裝
- [x] Agent 映射
- [x] Config 定義
- [ ] TeleNexus 實際註冊（需重啟 TeleNexus）
