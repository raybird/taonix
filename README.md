# Taonix (v16.2.0)

> **AI 工程作業系統**：基於 MCP、心智黑板與事件總線的工業級多智能體框架。

## 🤖 AI Agent 即插即用指南 (AI-First)

如果你是一個正在連接 Taonix 的 AI Agent，請閱讀此處：

### 1. 喚醒專家 (MCP 整合)
Taonix 提供標準的 **Model Context Protocol (MCP)** 服務。連接後你將獲得以下實體工具：
- `coder_action`: 執行實體代碼讀寫與 Shell 指令。
- `oracle_action`: 執行自動化架構掃描與依賴分析。
- `explorer_action`: 取得 GitHub Trending 與網頁事實。
- `router_route`: 模糊意圖自動分發。

**啟動指令：**
```bash
node projects/taonix/mcp-server/index.js
```

### 2. 心智同步 (Blackboard)
所有重要事實必須沉澱至 `Blackboard`。
- **讀取事實**：`cat .data/blackboard_state.json`
- **通訊協議**：發布事件至 `EventBus` 前，請務必參閱 `ai-engine/lib/event-schema.js` 的強型別定義。

---

## 🚀 快速開始

### 1. 穩定性安裝 (宿主機)
建議在宿主機直接運行 Web 控制台以確保連線不中斷：
```bash
cd projects/taonix/web-console
node server.js
# 訪問 http://localhost:3000 (或 3031 對映埠)
```

### 2. 驅動助理
```bash
# 指派特定專家執行任務
node agents/assistant/index.js broadcast oracle "執行專案結構健檢"
```

### 3. 自我描述與能力地圖
查看全系統能力定義：
```bash
cat projects/taonix/MANIFEST.json
```

## 🛠️ 核心功能 (紮實版)
- **事件 Schema 校驗**：拒絕任何不符規範的非法通訊，確保系統穩定。
- **執行調度器 (Dispatcher)**：內建 3 次自動重試與 30 秒超時阻斷機制。
- **動態資源 GC**：自動清理過大日誌與過期事實，保持系統輕量。
- **全路徑解耦**：支援任何工作目錄，徹底消除硬編碼。

---
*Taonix: 不僅能對話，更能實體執行。*
