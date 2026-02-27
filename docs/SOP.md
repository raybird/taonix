# Taonix 標準作業程序 (SOP)

## 開發流程

### 1. 功能開發

1. 在 `taonix/` 目錄下開發新功能
2. 遵循現有程式碼風格（ESM、Commander.js）
3. 新增測試驗證功能
4. 更新 SOP 文件（模組說明、技能清單）
5. 遵循 Git 提交規範

### 2. 本地測試

```bash
# 測試各 Agent CLI
cd agents/explorer && node index.js [指令]
cd agents/coder && node index.js [指令]

# 測試 MCP Server
cd mcp-server && node index.js
```

### 3. 功能檢查清單

- [x] 功能模組正常運作
- [x] CLI 指令正確響應
- [x] 輸出格式符合預期
- [x] 無語法錯誤

### 4. Git 提交

```bash
git add .
git commit -m "描述變更"
git push
```

---

## 模組說明

| 模組          | 路徑                | 功能                           |
| ------------- | ------------------- | ------------------------------ |
| Explorer      | `agents/explorer/`  | 搜尋、爬蟲、網頁擷取           |
| Coder         | `agents/coder/`     | 讀寫指令、Debug 檔案、執行     |
| Oracle        | `agents/oracle/`    | 架構分析、依賴分析             |
| Reviewer      | `agents/reviewer/`  | 品質檢查、格式檢查             |
| AI Engine     | `ai-engine/`        | 意圖理解、Agent 調度、內容生成 |
| Complexity    | `ai-engine/lib/`    | 規模自適應、複雜度分析         |
| Skills Core   | `skills/`           | 技能框架核心、8 個技能自動觸發 |
| Skill Matcher | `skills/matcher.js` | 根據輸入關鍵字自動選擇正確技能 |
| Self-Learning | `memory/`           | 記住使用者偏好與統計數據       |
| MCP Server    | `mcp-server/`       | MCP 協定服務                   |

---

## 技能清單

| 技能                           | 功能                        |
| ------------------------------ | --------------------------- |
| brainstorming                  | 頭腦風暴                    |
| systematic-debugging           | 系統化除錯 (4 階段根因分析) |
| test-driven-development        | TDD 流程                    |
| receiving-code-review          | 接收審查回饋                |
| requesting-code-review         | 請求程式碼審查              |
| writing-plans                  | 撰寫實作計劃                |
| executing-plans                | 執行實作計劃                |
| verification-before-completion | 完成前驗證                  |

---

## 規模自適應

| 複雜度 | 關鍵字範例                  | Agent 組合                  |
| ------ | --------------------------- | --------------------------- |
| 簡單   | 什麼/怎麼/看看/list/查      | Explorer                    |
| 中等   | debug/fix/improve/add/功能  | Explorer + Coder            |
| 複雜   | architecture/重構/系統設計/ | Explorer + Coder + Oracle + |
|        | compare/完整/end-to-end     | Reviewer (Party Mode)       |

---

## 發布檢查清單

- [x] 所有模組測試通過
- [x] 文件更新（docs/）
- [x] README.md 同步更新
- [x] Commit 已推送到 GitHub

---

## 文件同步規則

每次 Taonix 進化完成後必須：

1. 更新 `ROADMAP.md` - 標記已完成項目、新增規劃項目
2. 更新 `README.md` - 確保功能說明與實際一致
3. 更新 `CHANGELOG.md` - 記錄版本變更
4. Commit 並 push 到 GitHub

### 文件清單

| 文件                    | 說明                |
| ----------------------- | ------------------- |
| README.md               | 專案總覽與快速開始  |
| SOP.md                  | 標準作業程序        |
| ROADMAP.md              | 發展藍圖與版本規劃  |
| CHANGELOG.md            | 版本變更記錄        |
| taonix-design.md        | 設計文件與架構說明  |
| ai-capability-design.md | AI 能力設計文件     |
| cli-mcp-plan.md         | CLI 與 MCP 開發計畫 |
