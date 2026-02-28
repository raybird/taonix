# Taonix 架構演進藍圖 (Architecture Evolution)

> 本文件記錄了 Taonix 從「多智能體工具集」邁向「自主智能體叢集」的長期架構優化方向。

## 核心優化目標

### 1. 事件驅動協作 (Event-Driven Architecture)
*   **願景**: 消除中心化 Router 的強耦合，實現 Agent 間的自發性協作 (Choreography)。
*   **構想**: 
    - 引入事件總線 (Event Bus)。
    - Agent 不再只是被動接收指令，而是訂閱特定事件 (例如 `CODE_WRITTEN`, `SEARCH_RESULT_READY`) 並自動觸發對應技能。
*   **預計效益**: 提高系統並行能力與擴展性。

### 2. 黑板模式與全域狀態 (Blackboard Pattern)
*   **願景**: 讓 `Knowledge Bridge` 從片段快取進化為全域知識中樞。
*   **構想**: 
    - 實作共享的全域狀態機 (Shared World State)。
    - 整合向量資料庫 (Vector Store) 進行長程記憶檢索。
    - 儲存「推理鏈路」而非僅僅是輸出結果。
*   **預計效益**: 強化 Agent 對任務上下文的理解深度。

### 3. 層級化路由 (Hierarchical Squads)
*   **願景**: 解決單一 Router 意圖空間過大的問題。
*   **構想**: 
    - 實作「小隊制」管理。
    - 設立領域組長 (Lead Agent)，負責特定範疇（如開發小隊、研究小隊）的子路由。
*   **預計效益**: 大幅提高複雜意圖識別的準確度。

### 4. 自動仲裁機制 (Conflict Resolution)
*   **願景**: 解決多 Agent 意見分歧時的決策僵局。
*   **構想**: 
    - 引入仲裁者角色 (Arbitrator) 或投票機制。
    - 當 Coder 與 Reviewer 發生衝突時，自動觸發高階分析或使用者介入。
*   **預計效益**: 增加系統在處理模糊任務時的魯棒性。

### 5. 沙盒化動態執行 (Sandboxed Execution)
*   **願景**: 在支援外部技能下載的同時，確保系統安全性。
*   **構想**: 
    - 針對 `Remote Loader` 載入的第三方技能，實作隔離運行環境。
    - 使用 Node.js `vm` 或輕量級容器限制資源存取權限。
*   **預計效益**: 實作「下載即用」的安全性保證。

---
*Last Updated: 2026-02-28*
