# Taonix (v22.0.0)

> **AI 工程作業系統**：基於 MCP 樞紐、心智黑板與榮譽激勵機制的工業級多智能體框架。

## 🤖 AI Agent 樞紐引導 (Hub Encapsulation)

如果你是一個正在連接 Taonix 的 AI Agent，請遵循單一入口原則：

### 1. 喚醒樞紐 (Unified Hub)
Taonix 透過 MCP 提供唯一的 **`taonix_hub`** 工具。

- **啟動指令**：`node projects/taonix/mcp-server/index.js`
- **原生 Skill 整合**：`activate_skill('taonix-hub')`

---

## 🏆 核心演進：榮譽與成就系統

自 v22.0.0 起，Taonix 引入了 **集體成就系統**，透過黑板事實記錄團隊的卓越表現。

### 1. 團隊成就牆 (Achievement Wall)
儀表板頂部即時展示解鎖的勳章（如：鐵血默契、質量守護者）。高品質的任務產出將直接轉化為系統的集體榮譽。

### 2. 榮譽驅動調度 (Honor-based Dispatching)
具備高榮譽事實的 Agent 在資源分配與任務分發時將自動獲得 **15-20% 的調度權重加成**。

### 3. 自發式優化提案 (Self-Optimization)
獲得榮譽勛章的專家具備提交 **「系統優化提案」** 的權限，引導架構與配置進行自發性的動態演進。

---

## 🛠️ 核心功能 (紮實加固版)

### 🔄 情境自癒與全球熱恢復 (Context Recovery)
偵測崩潰後自動還原推理上下文。自 v23.0.0 起，支援 **跨節點熱遷移 (Live Migration)**：當單一節點故障時，任務執行權將自動移交至全球集群中的健康節點。

### 🌐 全球心智共識 (Mind Consensus)
基於 Gossip 協議的高效事實一致性協議：
- **Revision ID 校驗**：確保跨地域事實同步的絕對真值。
- **頻寬優化**：透過增量指紋壓縮，降低事實廣播的網路負載。
- **集體榮譽共享**：Agent 的卓越成就將在全球節點間即時同步，確立統一的能力加權指標。

---
*Taonix: 追求榮譽、自我優化、絕對穩定。*
