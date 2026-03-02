# Taonix (v19.0.0)

> **AI 工程作業系統**：基於 MCP 樞紐、心智黑板與自癒巡檢儀的工業級多智能體框架。

## 🤖 AI Agent 樞紐引導 (Hub Encapsulation)

如果你是一個正在連接 Taonix 的 AI Agent，請遵循單一入口原則：

### 1. 喚醒樞紐 (Unified Hub)
Taonix 透過 MCP 提供唯一的 **`taonix_hub`** 工具。你無須理解內部專家，只需提交你的「任務意圖」。

- **工具名稱**：`taonix_hub`
- **啟動指令**：
```bash
node projects/taonix/mcp-server/index.js
```

---

## 🚀 快速開始

### 1. 宿主機直連監控 (推薦)
為確保連線穩定，建議在宿主機啟動 Web 控制台：
```bash
# 指定掛載的數據目錄
export TAONIX_DATA_DIR="/app/workspace/projects/taonix/.data"
cd projects/taonix/web-console
node server.js
# 訪問 http://localhost:3000
```

### 2. 環境感知與意圖生成
```bash
# 讓 Oracle 自動掃描專案並更新意圖模板
node agents/assistant/index.js broadcast oracle "scan-projects"
```

---

## 🛠️ 核心功能 (紮實加固版)

### 🩺 系統穩定性巡檢儀 (Health Check)
每 15 分鐘自動執行全系統健檢，包含黑板一致性、物理探針活性與沙盒隔離完整性。

### 🔄 情境自癒與熱恢復 (Context Recovery)
偵測任務意外中斷後自動儲存「崩潰快照」，重啟後由助理引導還原執行上下文，確保長程任務續傳。

### 🛡️ 工業級安全沙盒 (Hardened Sandbox)
基於 Node vm 的嚴格隔離環境：
- **網絡攔截**：禁止訪問本地迴路與私有網段，防範 SSRF 攻擊。
- **FS 隔離**：限制技能僅能存取特定 `temp/` 或 `skills/` 目錄。

### 🧹 自律資源回收 (Resource GC)
自動截斷日誌並清理黑板過期事實，確保系統在長程運作下始終輕量且高效。

---
*Taonix: 紮實、自癒、安全。*
