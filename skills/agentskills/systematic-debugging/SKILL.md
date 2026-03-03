---
name: systematic-debugging
description: 系統化除錯 - 4 階段根因分析
metadata:
  triggers: ["bug","錯誤","error","fail","失敗","壞了","不工作","壞掉","問題","fix","修復"]
  keywords: ["除錯","debug","問題","崩潰","crash","exception","stack","trace"]
  intentTypes: ["bug","error","debug"]
  version: "1.0.0"
---

# Systematic Debugging

## Description
系統化除錯 - 4 階段根因分析

## Instructions
當遇到錯誤、異常或非預期行為時，Agent 必須遵循系統化的四階段除錯流程。

### 鐵律
**「未經根因調查，不做任何修復。」**

### Phase 1：根因調查
1. **仔細閱讀錯誤訊息**：完整讀取 stack trace、錯誤碼、日誌輸出
2. **穩定重現**：找到可靠的重現步驟，確認問題確實存在
3. **檢查近期變更**：用 `git log` / `git diff` 確認最近的程式碼異動
4. **逐層診斷**：多元件系統中，從外到內逐層排除
5. **追蹤資料流**：從輸入到輸出，追蹤資料在各層的轉換

### Phase 2：模式分析
1. 找到**可用的工作範例**（同模組中正常運作的相似功能）
2. 逐行比對工作範例與問題程式碼的差異
3. 記錄所有可疑差異點
4. 透過 `Blackboard.recordThought()` 記錄分析過程

### Phase 3：假說與測試
1. 根據分析結果，形成**單一假說**
2. 設計**最小變更**來驗證假說
3. 執行驗證，觀察結果是否符合預期
4. 若假說錯誤，回到 Phase 2 重新分析
5. **若 3 次以上修復嘗試失敗**，停下來質疑架構假設

### Phase 4：實作修復
1. 先建立一個**失敗測試**，精確捕捉 Bug 行為
2. 實作**單一修復**（一次只改一件事）
3. 執行測試，確認 Bug 已修復且無回歸
4. 透過 EventBus 發布 `debugging.resolved` 事件，附帶根因摘要

### 禁止事項
- 禁止不看錯誤訊息就開始猜測
- 禁止同時嘗試多個修復
- 禁止用 try-catch 掩蓋錯誤而非修復根因

## Recommended Agents
coder
