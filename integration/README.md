# Taonix TeleNexus 整合

## 概述

Taonix 透過 MCP 協議與 TeleNexus 整合，對外暴露單一 `taonix_hub` 工具，接收自然語言意圖後自動調度內部 Agent。

## 啟動 MCP Server

```bash
# 從專案根目錄
node mcp-server/index.js
```

## MCP Client 設定

在 TeleNexus 或其他 MCP Client 設定檔中新增：

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

## taonix_hub 工具

Taonix 對外僅提供**單一工具** `taonix_hub`，取代早期版本的 13 個獨立工具。

**呼叫方式：**

```json
{
  "name": "taonix_hub",
  "arguments": {
    "intent": "幫我分析這個專案的架構"
  }
}
```

Hub 內部自動完成語義驗證、Agent 調度與技能匹配。

### 意圖對應表

| 意圖範例 | 自動分派 Agent |
|----------|----------------|
| 「搜尋最近 Python 趨勢」 | Explorer（滄溟） |
| 「幫我寫一個排序演算法」 | Coder（鑄焰） |
| 「分析這個專案的架構」 | Oracle（明鏡） |
| 「審查這段程式碼的品質」 | Reviewer（守闕） |
| 「設計一個登入頁面」 | Designer（天工） |
| 「定義這個功能的需求」 | Product（鴻圖） |
| 「執行測試」 | Tester（試煉） |
| 「規劃開發流程」 | Assistant（助理） |

### 回傳格式

```json
{
  "content": [
    {
      "type": "text",
      "text": "{\"intent\":\"...\",\"agent\":{...},\"content\":\"...\",\"skill\":null,\"agents\":[...]}"
    }
  ]
}
```

## 從舊版遷移

v16.0.0 之前的版本暴露多個獨立 MCP 工具（如 `explorer_github_trending`、`coder_read_file` 等）。現已統一為 `taonix_hub` 單一入口：

| 舊工具 | 遷移方式 |
|--------|----------|
| `explorer_github_trending` | `taonix_hub({ intent: "搜尋 GitHub 趨勢" })` |
| `coder_read_file` | `taonix_hub({ intent: "讀取檔案 path/to/file" })` |
| `oracle_analyze_structure` | `taonix_hub({ intent: "分析專案結構" })` |
| `reviewer_check_quality` | `taonix_hub({ intent: "檢查程式碼品質" })` |

所有意圖皆由 Hub 內部的意圖理解引擎自動路由至對應 Agent。

## 整合狀態

- [x] MCP Server 開發
- [x] Client 封裝
- [x] Agent 映射
- [x] Config 定義
- [x] 統一 Hub 入口（v16.0.0+）
