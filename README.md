# Taonix

> **理想 AI 助理的完全體**：基於事件驅動、黑板模式與元進化能力的超智能協作系統。

## 概述

Taonix (道之樞紐) 是一個賦予 TeleNexus 「長程執行力」與「自我演化能力」的多智能體系統。它不再只是工具的集合，而是一個具備共同心智 (Blackboard) 與反射神經 (Event Bus) 的自組織智能生態。

## 核心架構 (v9.0.0+)

- **🧠 心智黑板 (Blackboard)**: 共享的全域事實牆與推理鏈路，讓 Agent 之間能共享「思考過程」。
- **📡 事件總線 (Event Bus)**: 全非同步的反應式協作架構，支援「廣播與監聽」。
- **⛓️ 長程編排 (Orchestration)**: 持久化任務狀態機，支援跨日執行與斷點續傳。
- **🛠️ 元進化 (Meta-Evolution)**: 內建技能建築師，能根據任務需求自動編寫並安裝新技能。
- **🛡️ 安全沙盒 (Sandbox)**: 基於 Node.js VM 的零信任執行環境與動態權限控管。
- **📊 視覺化全景 (Web Console)**: 八欄式即時監控，包含小隊拓樸、英雄榜與環境監控。

## 快速開始

### 啟動控制台 (推薦)
```bash
cd projects/taonix/web-console
node server.js
# 訪問 http://localhost:3000 查看八欄式即時監控
```

### 啟動長程工作流
```bash
# 透過助理啟動一個複雜的工程任務
node agents/assistant/index.js workflow "請分析目前的排程問題並設計一個自癒方案"
```

### 監控事件流
```bash
node agents/assistant/index.js monitor
```

## Agent 團隊與技能
詳細資訊請參閱 [docs/AGENTS.md](./docs/AGENTS.md) 與 [docs/ROADMAP.md](./docs/ROADMAP.md)。

## 技術棧
- **Runtime**: Node.js (ESM), tsx
- **Comm**: Model Context Protocol (MCP), EventEmitter
- **Intelligence**: AICaller (OpenAI/Ollama/Gemini)
- **Data**: JSONL (Audit), Blackboard (Shared State)

---
*Taonix: 進化永不停止。*
