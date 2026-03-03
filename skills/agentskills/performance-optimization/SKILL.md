---
name: performance-optimization
description: 效能優化 - 分析並改善程式效能瓶頸
metadata:
  triggers: ["效能","優化","效能瓶頸","速度","效能調校","優化建議","慢","卡"]
  keywords: ["效能","優化","performance","optimization","speed","bottleneck"]
  intentTypes: ["optimization","performance"]
  version: "1.0.0"
---

# Performance Optimization

## Description
效能優化 - 分析並改善程式效能瓶頸

## Instructions
當需要分析或改善程式效能時，Agent 應遵循以下流程：

### Step 1：效能問題定位
1. 確認效能指標：回應時間、記憶體使用、CPU 使用率、吞吐量
2. 建立基準線：在優化前量測當前效能數據
3. 識別瓶頸：使用 profiling 工具定位熱點
   - Node.js：`--prof`、`clinic.js`、`0x`
   - 通用：記憶體快照、CPU flame graph

### Step 2：瓶頸分析
1. 分類瓶頸類型：
   - **I/O 瓶頸**：檔案讀寫、網路請求、資料庫查詢
   - **CPU 瓶頸**：演算法複雜度、迴圈效率、序列化開銷
   - **記憶體瓶頸**：記憶體洩漏、過大的資料結構、GC 壓力
2. 透過 `Blackboard.recordThought()` 記錄分析結論

### Step 3：優化實作
1. **一次只優化一個瓶頸**
2. 常見優化策略：
   - 快取（記憶體快取、HTTP 快取、計算結果快取）
   - 批次處理（合併 I/O 操作、批次資料庫查詢）
   - 延遲載入（按需載入模組、延遲初始化）
   - 演算法改進（降低時間/空間複雜度）
   - 並行化（Promise.all、Worker Threads）
3. 每個優化都必須有對應的效能測試

### Step 4：驗證效果
1. 使用相同的基準線量測優化後效能
2. 確認改善幅度與預期一致
3. 確認優化未破壞現有功能（執行完整測試套件）
4. 透過 EventBus 發布 `performance.optimized` 事件，附帶前後對比數據

### 鐵律
- 禁止未量測就優化（premature optimization）
- 禁止同時進行多項優化（無法歸因改善來源）
- 優化前必須有基準線數據

## Recommended Agents
oracle

