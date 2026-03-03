---
name: requesting-code-review
description: 請求程式碼審查
metadata:
  triggers: ["review","審查","檢查","幫我看","幫我檢查","pull request","pr","merge"]
  keywords: ["code review","審查","檢視","確認"]
  intentTypes: ["review","merge"]
  version: "1.0.0"
---

# Requesting Code Review

## Description
請求程式碼審查

## Instructions
當任務完成後需要程式碼審查時，Agent 應遵循以下流程：

### Step 1：準備審查材料
1. 取得當前 git SHA 與變更摘要（`git diff --stat`）
2. 整理變更說明：修改了什麼、為什麼修改、影響範圍
3. 確認所有測試已通過（先執行 verification-before-completion）

### Step 2：調度審查員
1. 透過 EventBus 發布 `review.requested` 事件
2. 指定 Reviewer（守闕）作為主要審查 Agent
3. 附帶審查重點（安全性、效能、可維護性等）

### Step 3：分級處理回饋
收到審查結果後，依嚴重程度分級處理：

| 等級 | 處理方式 |
|------|----------|
| **Critical（致命）** | 立即修復，不得繼續其他工作 |
| **Important（重要）** | 在當前任務結束前修復 |
| **Minor（輕微）** | 記錄至 Blackboard，排入後續處理 |

### 強制觸發時機
- 每個子任務完成後
- 主要功能完成後
- 合併至 main 分支前

### 鐵律
- 禁止跳過審查直接合併
- 審查材料必須包含足夠的上下文讓審查員獨立理解

## Recommended Agents
reviewer

