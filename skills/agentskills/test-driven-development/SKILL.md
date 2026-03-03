---
name: test-driven-development
description: 測試驅動開發 - RED GREEN REFACTOR 流程
metadata:
  triggers: ["測試","test","unit test","單元測試","寫測試","新增功能","implement"]
  keywords: ["tdd","測試優先","red green","單元測試","整合測試","jest","vitest","pytest"]
  intentTypes: ["feature","implementation","test"]
  version: "1.0.0"
---

# Test Driven Development

## Description
測試驅動開發 - RED GREEN REFACTOR 流程

## Instructions
當需要實作新功能或修復 Bug 時，Agent 必須遵循 TDD 流程，以測試為先導。

### 鐵律
**「沒有失敗的測試，就不寫產品程式碼。」**

### 三階段循環：RED → GREEN → REFACTOR

#### RED（紅燈 — 寫失敗測試）
1. 撰寫最小的、會失敗的測試案例
2. 測試必須明確描述預期行為
3. 執行測試，**確認確實失敗**（並確認失敗原因正確）
4. 透過 `Blackboard.recordThought()` 記錄測試意圖

#### GREEN（綠燈 — 最小實作）
1. 用**最簡單的方式**讓測試通過
2. 不過度設計、不提前優化
3. 執行測試，**確認測試通過**
4. 若測試仍失敗，回到 RED 階段檢查測試是否正確

#### REFACTOR（重構 — 清理程式碼）
1. 在所有測試保持通過的前提下，清理程式碼
2. 消除重複、改善命名、簡化邏輯
3. 執行完整測試套件，**確認沒有回歸**
4. 提交 commit

### 執行守則
- 每個 RED→GREEN→REFACTOR 循環處理一個行為
- 循環結束後才能開始下一個功能點
- 若發現在測試前就寫了產品程式碼，立刻停止並回退
- 整合測試與單元測試並行，確保端到端行為正確

### 工具偏好
- JavaScript/TypeScript：Node.js 內建 `--test` 或 vitest
- Python：pytest
- 其他語言：選擇該語言最主流的測試框架

## Recommended Agents
coder
