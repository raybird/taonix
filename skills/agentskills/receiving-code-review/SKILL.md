---
name: receiving-code-review
description: 接收程式碼審查回饋
metadata:
  triggers: ["review","審查","feedback","回饋","意見","建議","critic","comments"]
  keywords: ["code review","審查意見","修改建議","改善","優化"]
  intentTypes: ["review"]
  version: "1.0.0"
---

# Receiving Code Review

## Description
接收程式碼審查回饋

## Instructions
當接收到程式碼審查回饋時，Agent 必須遵循以下六步驟回應流程：

### READ（完整閱讀）
- 完整讀取所有審查意見，不跳過任何一條
- 標記每條意見的嚴重程度（Critical / Important / Minor）

### UNDERSTAND（理解重述）
- 用自己的話重述每條回饋的要點
- 確認理解審查員的意圖，而非只看表面文字

### VERIFY（對照驗證）
- 對照 codebase 實際狀態，確認回饋描述的問題確實存在
- 若問題描述與現實不符，記錄差異

### EVALUATE（技術評估）
- 評估每條建議在當前 codebase 中是否技術上合理
- 進行 YAGNI 檢查：若建議「properly implement」某功能，先確認是否有人實際在用

### RESPOND（技術回覆）
- 對每條回饋提供技術性回覆
- 同意的：說明將如何實作
- 不同意的：提供有理據的反駁（附程式碼佐證）
- 透過 `Blackboard.recordThought()` 記錄決策過程

### IMPLEMENT（逐一實作）
- 逐條實作已同意的修改
- 每次修改後執行相關測試
- 全部完成後再次請求審查（requesting-code-review）

### 禁止回應
- 「You're absolutely right!」等表演性附和
- 「Great point!」等無實質內容的讚美
- 未經技術評估就全盤接受的回應

## Recommended Agents
coder

