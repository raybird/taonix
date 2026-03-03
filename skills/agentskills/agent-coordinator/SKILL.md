---
name: agent-coordinator
description: 智能代理協調 - 自動分派任務給合適的 Agent
metadata:
  triggers: []
  keywords: ["協調","分派","分配","coordination","delegate","多個 agent","團隊"]
  intentTypes: []
  version: "1.0.0"
---

# Agent Coordinator

## Description
智能代理協調 - 自動分派任務給合適的 Agent

## Instructions
當任務需要多個 Agent 協作時，Coordinator 負責智能分派與協調。

### Step 1：任務分析
1. 解析任務意圖，識別所需的能力類型
2. 查詢 Blackboard 上的 Agent 歷史表現與協作默契分數
3. 評估任務複雜度（低/中/高），決定所需 Agent 數量

### Step 2：小隊組建
1. 根據能力匹配與榮譽分數，選擇最適合的 Agent 組合
2. 透過 Squad Assembler 動態組建專家小隊
3. 指定每個 Agent 的子任務與預期交付物
4. 透過 EventBus 發布 `squad.assembled` 事件

### Step 3：任務分派
1. 依照任務依賴關係決定執行順序
2. 可平行的任務同時分派，必須循序的標註阻塞關係
3. 為每個子任務設定超時限制
4. 透過 `Blackboard.recordFact()` 記錄分派決策

### Step 4：進度監控與收斂
1. 監聽各 Agent 的完成事件
2. 若某 Agent 超時或失敗，觸發替代方案或通知 Self-Healer
3. 所有子任務完成後，彙整結果
4. 透過 Squad Debriefing 進行後驗總結

### 鐵律
- 分派必須基於能力匹配，不得隨機指派
- 單一 Agent 不得承擔超過其能力範圍的任務
- 協調過程必須透明，所有決策記錄於 Blackboard

## Recommended Agents
assistant

