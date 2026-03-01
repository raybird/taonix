# Taonix 設計文件 (Design Specification)

> **版本：v9.0.0+**
> **核心概念：道之樞紐 (The Nexus of Tao)**

## 一、 專案概述
Taonix 是一個具備自我演進能力的多智能體協作系統 (Multi-Agent System)。它不僅是 TeleNexus 的能力擴展，更是一個具備獨立思考鏈路 (Blackboard) 與反射神經 (Event Bus) 的自組織智能生態。

---

## 二、 核心架構 (V9.0+)

### 1. 反應式協作網路 (Event-Driven Architecture)
Taonix 採用「同儕協作 (Choreography)」模式，取代傳統的「命令-控制」模式。
- **Event Bus**: 核心神經網路，負責非同步事件廣播。
- **Agent Listener**: 各 Agent 具備主動監聽能力，能根據環境事件 (如 `GIT_COMMIT_DETECTED`) 自發啟動。

### 2. 心智黑板 (Blackboard Pattern)
解決多智能體間的「記憶碎片化」與「因果丟失」問題。
- **事實牆 (Facts Wall)**: 共享的全域共識數據。
- **推理鏈路 (Reasoning Chains)**: 紀錄 Agent 的「思考過程」而非僅結果，實現心智共享。

### 3. 元進化引擎 (Meta-Evolution)
系統具備「自我編程」能力。
- **Skill Architect**: 自動分析任務缺口，編寫並安裝新技能。
- **Sandbox**: 隔離執行環境，確保動態生成的代碼不會破壞系統安全。

---

## 三、 團隊角色 (AGENTS.md 簡述)

| 角色 | 核心能力 | 演進特質 |
| :--- | :--- | :--- |
| **Explorer** | 搜尋、趨勢、爬蟲 | 全網資訊觸手 |
| **Coder** | 實作、重構、感知執行 | 具備黑板感知的工程師 |
| **Oracle** | 架構分析、推理、深度決策 | 系統的邏輯核心 |
| **Arbitrator** | 衝突解決、根因分析 | 人類介入的決策支持者 |
| **Assistant** | 任務編排、長期規劃 | 長程任務狀態機的驅動者 |
| **Architect** | 技能生成、元進化 | 自我演化的造物主 |

---

## 四、 執行鏈路：長程編排 (v9.0)
Taonix 具備處理跨日、複雜工程任務的能力：
1. **目標分解**: Assistant 將目標拆解為 Task State Machine 可識別的節點。
2. **小隊組建**: 根據能力標籤自動組建虛擬小隊 (Squad)。
3. **共識達成**: 成員對方案進行投票與協商。
4. **持久執行**: 支援斷點續傳、環境快照與資源自動回收。

---

## 五、 設計原則 (The Tao)
1. **去中心化**: 盡可能讓 Agent 自發響應，而非由 Router 強制分配。
2. **透明化**: 推理過程必須寫入黑板，確保 AI 的行為可解釋。
3. **安全擴充**: 所有的動態技能載入必須經過沙盒審計。
4. **持續學習**: 透過集體經驗庫 (Experience Base) 優化選員策略。

---
*Last Updated: 2026-03-01*
