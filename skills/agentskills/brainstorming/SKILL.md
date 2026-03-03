---
name: brainstorming
description: 頭腦風暴 - 探索需求、設計與實作方向
metadata:
  triggers: ["如何","怎麼做","請幫我","要怎麼","可以怎麼","應該怎麼","幫我規劃","帮我规划"]
  keywords: ["功能","設計","架構","方案","實現","實作","思路"]
  intentTypes: ["feature","design","planning"]
  version: "1.0.0"
---

# Brainstorming

## Description
頭腦風暴 - 探索需求、設計與實作方向

## Instructions
當使用者提出需求、功能構想或設計問題時，Agent 應遵循以下三階段流程：

### Phase 1：初始探索（需求澄清）
1. 審視專案現況，檢查 Blackboard 上的相關事實與推理紀錄
2. 逐一提出澄清問題（一次一題），偏好選擇題而非開放式問題
3. 確認使用者的核心目標、限制條件與優先順序

### Phase 2：方案探索（多元比較）
1. 提出 2-3 種可行方案，每個方案包含：
   - 方案概述（一句話總結）
   - 優勢與風險（trade-off 分析）
   - 預估影響範圍（涉及哪些 Agent 與模組）
2. 遵循 YAGNI 原則：不需要的就不做
3. 透過 `Blackboard.recordThought()` 記錄推理過程

### Phase 3：設計呈現（結構化輸出）
1. 將驗證過的方案拆解為 200-300 字的段落，涵蓋：
   - 架構設計（元件關係與資料流）
   - 技術選型（框架、工具、協議）
   - 錯誤處理策略
   - 測試策略
2. 每個段落設置檢查點，確保可追蹤進度
3. 透過 EventBus 發布 `brainstorming.completed` 事件，附帶結論摘要

### 鐵律
- 禁止在探索階段就直接跳到實作
- 所有方案必須有明確的 trade-off 分析
- 使用者未確認前，不得鎖定方案

## Recommended Agents
oracle

