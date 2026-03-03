---
name: security-audit
description: 安全審計 - 識別程式碼安全漏洞與風險
metadata:
  triggers: ["安全","漏洞","審計","資安","XSS","SQL injection","權限","認證","加密"]
  keywords: ["安全","漏洞","審計","資安","audit","security","vulnerability"]
  intentTypes: ["security","review"]
  version: "1.0.0"
---

# Security Audit

## Description
安全審計 - 識別程式碼安全漏洞與風險

## Instructions
當需要進行安全審計或識別程式碼漏洞時，Agent 應遵循以下流程：

### Step 1：掃描範圍界定
1. 確認審計目標（全專案 / 特定模組 / 特定 PR）
2. 識別技術棧與框架（Node.js / Python / 前端等）
3. 列出已知的敏感操作點（認證、授權、資料庫操作、檔案操作）

### Step 2：OWASP Top 10 檢查
逐項檢查以下常見漏洞類型：
1. **注入攻擊**（SQL Injection、Command Injection、XSS）
2. **身份驗證缺陷**（弱密碼策略、Session 管理、JWT 處理）
3. **敏感資料外洩**（明文儲存、日誌洩漏、硬編碼密鑰）
4. **存取控制缺失**（越權存取、路徑穿越、CORS 配置）
5. **安全配置錯誤**（預設憑證、除錯模式、多餘端口）
6. **已知漏洞元件**（過時依賴、已知 CVE）
7. **請求偽造**（CSRF、SSRF）

### Step 3：產出審計報告
1. 依嚴重程度分級：Critical / High / Medium / Low / Info
2. 每個發現必須包含：
   - 漏洞位置（檔案路徑 + 行號）
   - 風險說明（可能的攻擊路徑）
   - 修復建議（具體的程式碼修改）
3. 透過 `Blackboard.recordFact()` 記錄審計結果

### Step 4：修復驗證
1. 修復後重新執行相關檢查
2. 確認修復未引入新的安全問題
3. 透過 EventBus 發布 `security.audit.completed` 事件

## Recommended Agents
reviewer

