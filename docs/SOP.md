# Taonix 標準作業程序 (SOP)

> **版本：v9.0.0+**
> **原則：文檔領先、自動驗證、標籤同步**

## 一、 開發工作流 (Standard Flow)

### 1. 規劃階段
- 更新 `planning/cli.js` 目錄下的長期目標。
- 在 `docs/ROADMAP.md` 標註新階段。

### 2. 開發與測試
- 遵循 **ESM** 規範與 **Node.js v22+** 環境。
- **事件驅動**: 所有跨 Agent 通訊必須透過 `EventBus`。
- **黑板紀錄**: 關鍵推理過程必須調用 `Blackboard.recordThought`。
- **安全沙盒**: 第三方腳本必須透過 `SkillSandbox` 驗證。

### 3. 驗證階段
- 執行端到端協作測試 (如 `test-event-driven.js`)。
- 核實 Web 控制台是否正確顯示拓樸與事實變動。

## 二、 發布與同步 (Release SOP) - 重要

每次功能更新或里程碑達成後，**必須**依序執行以下步驟：

1. **同步文件**:
   - 更新 `docs/CHANGELOG.md` (記錄變更)。
   - 更新 `README.md` (版本號與功能圖)。
   - 確保 `docs/AGENTS.md` 包含新增的角色。
2. **Git Commit**:
   - `git add .`
   - `git commit -m "feat/fix: <描述>"`
3. **Git Tag**:
   - `git tag vX.Y.Z` (遵循語義化版本)。
4. **Git Push**:
   - `git push origin master --tags`

## 三、 系統維護 (Self-Healing)
- 定期執行 `SelfHealingAgent.diagnoseAndHeal()`。
- 檢查 `.data/` 目錄下的日誌與狀態檔案完整性。

---
*Taonix SOP: 規範是進化的保證。*
