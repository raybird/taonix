---
name: doc-generator
description: 文檔生成 - 自動生成 API 文件、README、註解
metadata:
  triggers: ["文件","文檔","說明","註解","生成文件","寫文件","API 文件","readme"]
  keywords: ["文件","文檔","說明","註解","doc","readme","documentation"]
  intentTypes: ["documentation","writing"]
  version: "1.0.0"
---

# Doc Generator

## Description
文檔生成 - 自動生成 API 文件、README、註解

## Instructions
當需要生成或更新文件時，Agent 應遵循以下流程：

### Step 1：分析文件需求
1. 確認文件類型：README / API 文件 / CHANGELOG / 程式碼註解 / 使用手冊
2. 確認目標讀者：開發者 / 使用者 / 維運人員
3. 掃描現有文件，避免重複撰寫

### Step 2：收集素材
1. 讀取相關原始碼，提取公開 API、函式簽名、型別定義
2. 查閱 Blackboard 上的設計決策與推理紀錄
3. 檢查 git log 取得變更歷史（用於 CHANGELOG）
4. 收集使用範例與測試案例作為文件範例

### Step 3：撰寫文件
依照文件類型遵循對應格式：

#### README
- 專案概述（一段話）→ 快速開始 → 安裝 → 使用範例 → API 參考 → 貢獻指南

#### API 文件
- 每個公開函式/類別/端點都需要：簽名、參數說明、回傳值、使用範例、錯誤情境

#### CHANGELOG
- 遵循 Keep a Changelog 格式：Added / Changed / Fixed / Removed
- 每條變更附帶簡潔說明

#### 程式碼註解（JSDoc / DocString）
- 僅為邏輯不自明的區塊添加註解
- 註解說明「為什麼」而非「做什麼」

### Step 4：驗證與交付
1. 確認文件中的程式碼範例可實際執行
2. 確認連結與路徑正確
3. 文件語言以繁體中文（台灣用語）為主
4. 透過 EventBus 發布 `doc.generated` 事件

### 鐵律
- 禁止修改程式邏輯（僅文件操作）
- 禁止主觀臆測功能行為，必須基於原始碼事實
- 所有技術描述必須可追溯至程式碼

## Recommended Agents
product

