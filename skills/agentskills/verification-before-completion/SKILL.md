---
name: verification-before-completion
description: 完成前驗證
metadata:
  triggers: ["完成","done","完成","結束","submit","commit","發布","release"]
  keywords: ["驗證","確認","檢查","通過","正確"]
  intentTypes: ["complete","release"]
  version: "1.0.0"
---

# Verification Before Completion

## Description
完成前驗證

## Instructions
在宣告任何任務完成之前，Agent 必須通過強制驗證閘門。

### 鐵律
**「沒有新鮮的驗證證據，不得宣告完成。」**

### 閘門函式：IDENTIFY → RUN → READ → VERIFY

#### IDENTIFY（識別驗證方式）
- 確定哪些指令、測試或檢查能證明任務已完成
- 列出所有必要的驗證項目

#### RUN（執行驗證）
- 執行完整的驗證指令（非截斷、非節錄）
- 包含：測試套件、lint 檢查、建置、手動驗證步驟

#### READ（完整讀取結果）
- 完整讀取所有輸出與 exit code
- 不跳過任何 warning 或異常訊息

#### VERIFY（確認結果）
- 逐項確認輸出是否證實任務聲明
- 所有驗證項目都必須通過

### 只有通過閘門後才能宣告完成

### 禁止用詞
以下用語在驗證通過前**禁止使用**：
- 「should pass」、「probably works」、「seems to」
- 「Great!」、「Perfect!」、「Done!」等感嘆詞
- 任何未經驗證的完成性聲明

### 驗證清單
- [ ] 所有相關測試通過
- [ ] 無新增的 lint / type 錯誤
- [ ] 變更範圍與預期一致（無多餘修改）
- [ ] 程式碼已正確提交（若需要）
- [ ] 透過 `Blackboard.recordFact()` 記錄完成事實

## Recommended Agents
reviewer

