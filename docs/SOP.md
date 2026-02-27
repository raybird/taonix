# Taonix 標準作業程序 (SOP)

## 開發流程

### 1. 功能開發

1. 在 `taonix/` 目錄下開發新功能
2. 遵循現有程式碼風格（ESM、Commander.js）
3. 新增測試驗證功能

### 2. 本地測試

```bash
# 測試各 Agent CLI
cd agents/explorer && node index.js [指令]
cd agents/coder && node index.js [指令]

# 測試 MCP Server
cd mcp-server && node index.js
```

### 3. 功能檢查清單

- [ ] 功能模組正常運作
- [ ] CLI 指令正確響應
- [ ] 輸出格式符合預期
- [ ] 無語法錯誤

### 4. Git 提交

```bash
git add .
git commit -m "描述變更"
git push
```

---

## 模組說明

| 模組       | 路徑               | 功能                           |
| ---------- | ------------------ | ------------------------------ |
| Explorer   | `agents/explorer/` | 搜尋、爬蟲、網頁擷取           |
| Coder      | `agents/coder/`    | 讀寫檔案、執行指令、Debug      |
| Oracle     | `agents/oracle/`   | 架構分析、依賴分析             |
| Reviewer   | `agents/reviewer/` | 品質檢查、格式檢查             |
| AI Engine  | `ai-engine/lib/`   | 意圖理解、Agent 調度、內容生成 |
| MCP Server | `mcp-server/`      | MCP 協定服務                   |

---

## 發布檢查清單

- [ ] 所有模組測試通過
- [ ] 文件更新（docs/）
- [ ] README.md 同步更新
- [ ] Commit 已推送到 GitHub
