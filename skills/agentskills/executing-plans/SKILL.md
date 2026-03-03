---
name: executing-plans
description: 執行實作計劃
metadata:
  triggers: ["執行","implement","實作","開始做","動工"]
  keywords: ["計劃","方案","實作","開發","施工"]
  intentTypes: ["implementation"]
  version: "1.0.0"
---

# Executing Plans

## Description
執行實作計劃

## Instructions
當需要依照既有計劃批次執行實作任務時，Agent 應遵循以下五步驟流程：

### Step 1：載入與審視計劃
1. 從 `docs/plans/` 或 Blackboard 載入目標計劃
2. 批判性審視計劃內容：是否有遺漏、矛盾或過時的假設
3. 若發現問題，回報給使用者並等待修正，不自行猜測

### Step 2：批次執行
1. 預設每批執行 3 個任務
2. 每個任務依序執行：
   - 讀取任務規格
   - 調度對應 Agent（透過 EventBus 發布任務事件）
   - 收集執行結果
3. 透過 `Blackboard.recordThought()` 記錄執行進度

### Step 3：批次報告
每批完成後，向使用者回報：
- 已完成的任務與實作內容
- 驗證輸出（測試結果、執行日誌）
- 等待使用者回饋後才繼續下一批

### Step 4：回饋調整
1. 根據使用者回饋調整後續任務
2. 若需修改計劃，更新 `docs/plans/` 中的計劃文件
3. 繼續下一批執行

### Step 5：完成收尾
1. 所有任務完成後，執行 verification-before-completion 技能
2. 確保所有測試通過、程式碼已提交
3. 透過 EventBus 發布 `plan.completed` 事件

### 鐵律
- 遇到阻塞立刻停止並回報，絕不猜測
- 絕不在 main/master 分支上直接實作
- 每批任務之間必須等待使用者確認

## Recommended Agents
coder

