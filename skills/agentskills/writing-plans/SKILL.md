---
name: writing-plans
description: 撰寫實作計劃
metadata:
  triggers: ["計劃","plan","規劃","方案","spec","規格","文件"]
  keywords: ["實作","實現","開發","實作計劃","實作方案"]
  intentTypes: ["planning","design"]
  version: "1.0.0"
---

# Writing Plans

## Description
撰寫實作計劃

## Instructions
當需要將構想轉化為可執行的實作計劃時，Agent 應遵循以下流程：

### Step 1：定義計劃骨架
1. 建立計劃文件，存放至 `docs/plans/YYYY-MM-DD-<feature-name>.md`
2. 填寫標準 Header：
   - **Goal**：一句話描述目標
   - **Architecture**：受影響的模組與 Agent
   - **Tech Stack**：使用的技術與工具

### Step 2：拆解為 Bite-Sized 任務
1. 每個任務控制在 2-5 分鐘可完成的粒度
2. 每個任務遵循 TDD 節奏：
   - 寫失敗測試 → 驗證確實失敗 → 實作功能 → 驗證測試通過 → commit
3. 任務必須包含：
   - 確切的檔案路徑
   - 完整的程式碼範例或虛擬碼
   - 確切的執行指令與預期輸出

### Step 3：標註依賴與排序
1. 標示任務間的依賴關係（哪些可平行，哪些必須循序）
2. 標示每個任務的建議 Agent（coder / tester / oracle 等）
3. 透過 `Blackboard.recordFact()` 記錄計劃結構

### Step 4：交付與執行選項
完成計劃後，提供兩種執行方式：
- **同步執行**：在當前 session 中逐批執行（搭配 executing-plans 技能）
- **非同步分派**：透過 EventBus 將任務分派給對應 Agent

### 鐵律
- 計劃中不得有模糊描述（如「適當處理錯誤」），必須具體
- 每個任務必須可獨立驗證成功或失敗
- 計劃完成前必須經過使用者確認

## Recommended Agents
oracle

