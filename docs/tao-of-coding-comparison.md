# Taonix vs tao-of-coding 比對分析

> 分析日期：2026-03-03
> Taonix 版本：v23.0.0
> tao-of-coding 版本：SKILL.md v4.0.0
> 參考來源：https://github.com/raybird/tao-of-coding

---

## 背景

Taonix 的設計初衷是讓 AI agent 擁有自己的 AI 團隊，以 tao-of-coding（oh-my-opencode-slim + superpowers）為藍圖，提供統一入口讓 agent 自主判斷行動，從 CLI 進展到 MCP 再封裝為 Skill。

本分析旨在確認 Taonix v23.0.0 與 tao-of-coding 的對齊程度，並識別差異與建議。

---

## 一、角色對應（5 → 8+）

### tao-of-coding 角色定義

tao-of-coding 定義了 5 個角色，搭配 Flash/Pro 分級：

| 角色 | 模型層級 | 核心職責 |
|------|----------|----------|
| Explorer | Flash（輕量）| 結構洞察：專案掃描、依賴追蹤、架構模式識別、檔案定位 |
| Oracle | Pro（重量）| 架構專家：深度重構、架構審查、複雜除錯、技術決策 |
| Librarian | Flash（輕量）| 文件專家：README/API 文檔撰寫、JSDoc/DocString、i18n 翻譯、長篇摘要 |
| Fixer | Flash（輕量）| 實作專家：單元測試、語法修復、格式調整、小規模重構 |
| Designer | Pro（重量）| 設計專家：UI 實作、組件設計、樣式優化、互動設計 |

### 對應關係

| tao-of-coding 角色 | Taonix 對應 | 狀態 | 說明 |
|---------------------|-------------|------|------|
| Explorer | explorer（滄溟）| ✅ 完全對齊 | 搜尋、偵查、趨勢追蹤 |
| Oracle | oracle（明鏡）| ✅ 完全對齊 | 架構分析、深度推理 |
| Librarian | ❌ 無直接對應 | ⚠️ 缺失 | 文件撰寫、API 註解、i18n 翻譯 |
| Fixer | coder（鑄焰）吸收 | 🔄 合併 | Bug 修復、測試補全由 Coder 承擔 |
| Designer | designer（天工）| ✅ 完全對齊 | UI/UX 設計 |
| — | reviewer（守闕）| ➕ Taonix 獨有 | 代碼審查、品質把關 |
| — | product（鴻圖）| ➕ Taonix 獨有 | 產品規劃、需求分析 |
| — | tester（試煉）| ➕ Taonix 獨有 | 測試自動化 |
| — | assistant（助理）| ➕ Taonix 獨有 | 核心協調、任務排程、記憶搜尋 |
| — | self-healer（自癒者）| ➕ Taonix 獨有 | 系統診斷、自動修復 |

### 分析

**Taonix 以 8+ 角色超集覆蓋 tao-of-coding 的 5 角色。**

- **Fixer 合併入 Coder**：合理的設計選擇。tao-of-coding 的 Fixer 負責單元測試、語法修復、格式調整、小規模重構；Taonix 的 Coder（鑄焰）以更廣泛的「程式實作與檔案操作」涵蓋這些職責，且搭配獨立的 Tester 分擔測試職能。
- **Librarian 缺失**：唯一未直接對應的角色。tao-of-coding 中 Librarian 主責 README/API 文檔撰寫、JSDoc/DocString 標註、i18n 翻譯、長篇摘要。Taonix 中此職責分散於 Product（鴻圖）和 `doc-generator` 技能，但缺乏 i18n 翻譯和 JSDoc 自動標註的專責承擔者。
- **Taonix 獨有角色**：Reviewer、Product、Tester、Assistant、Self-Healer 等角色反映 Taonix 更精細的團隊分工。

---

## 二、Superpowers 技能對應（8/8 完全覆蓋）

### tao-of-coding 8 大 Superpowers

來自上游 [obra/superpowers](https://github.com/obra/superpowers)（v4.2.0），tao-of-coding 將每個技能指派給主責角色：

| # | tao-of-coding Superpower | 主責角色 | Taonix Skill | 位置 | 狀態 |
|---|--------------------------|----------|--------------|------|------|
| 1 | brainstorming | Oracle | brainstorming | `skills/agentskills/brainstorming/` | ✅ 覆蓋 |
| 2 | writing-plans | Oracle | writing-plans | `skills/agentskills/writing-plans/` | ✅ 覆蓋 |
| 3 | executing-plans | Explorer | executing-plans | `skills/agentskills/executing-plans/` | ✅ 覆蓋 |
| 4 | test-driven-development | Fixer | test-driven-development | `skills/agentskills/test-driven-development/` | ✅ 覆蓋 |
| 5 | systematic-debugging | Fixer | systematic-debugging | `skills/agentskills/systematic-debugging/` | ✅ 覆蓋 |
| 6 | verification-before-completion | Fixer | verification-before-completion | `skills/agentskills/verification-before-completion/` | ✅ 覆蓋 |
| 7 | requesting-code-review | Librarian | requesting-code-review | `skills/agentskills/requesting-code-review/` | ✅ 覆蓋 |
| 8 | receiving-code-review | Fixer | receiving-code-review | `skills/agentskills/receiving-code-review/` | ✅ 覆蓋 |

### Taonix 額外技能（+5）

| # | Taonix 獨有 Skill | 說明 |
|---|-------------------|------|
| 1 | agent-coordinator | 智能代理協調，自動分派任務給合適的 Agent |
| 2 | security-audit | 安全審計，識別程式碼安全漏洞與風險 |
| 3 | doc-generator | 文檔生成，自動生成 API 文件、README、註解 |
| 4 | performance-optimization | 效能優化，分析並改善程式效能瓶頸 |
| 5 | remote-example | 遠端技能範例（示範用） |

### 分析

**8/8 superpowers 全數覆蓋，且多出 5 個擴展技能。**

值得注意的是，tao-of-coding 中每個 superpower 都有詳盡的執行步驟指引（如 TDD 的 RED→GREEN→REFACTOR 三階段、systematic-debugging 的四階段流程），而 Taonix 的技能目前 **Instructions 區塊尚為空白骨架**，依賴 SKILL.md 的 metadata 驅動匹配，具體執行指引有待填充。

---

## 三、架構概念對應

| tao-of-coding 概念 | 說明 | Taonix 實現 | 對齊度 |
|---------------------|------|-------------|--------|
| **統一入口** | `orchestrate-skill.sh` 自動路由 | `taonix_hub`（MCP 單一工具）| ✅ 完全對齊 |
| **Skill-Dispatch** | 兩段式：角色編排層 + 技能執行層 | SkillEngine + Matcher 三層路由（意圖→Agent→Skill）| ✅ 超越 |
| **Flash/Pro 分級** | 輕量任務用 Flash，深度任務用 Pro | ComplexityAnalyzer（低/中/高→不同 Agent 組合）| 🔄 概念類似 |
| **無狀態原則** | 所有代理皆無記憶、獨立運行 | ❌ 有狀態（Blackboard + EventBus + 情感持久化）| ⚠️ 理念不同 |
| **防遞迴契約** | Runtime Header + visited_skills + max_depth | 無直接對應機制 | ⚠️ 缺失 |
| **交付契約** | 三項必填（路徑/驗收標準/負責人）| 無顯式交付契約 | ⚠️ 缺失 |
| **強制查證** | 涉及最新資訊必須先工具查證 | 無顯式查證規範 | ⚠️ 缺失 |
| **提示詞優化** | Role Guide + Skill Doc 組裝 | PersonaAdapter + SemanticValidator | ✅ 有對應 |
| **技能路由表** | `skill-routing.conf`（INI 風格正則匹配）| SkillMatcher（關鍵字 + 意圖類型匹配）| ✅ 有對應 |
| **CLI 雙套入口** | 自動路由 + 手動指定角色/技能 | MCP 單一入口 + Agent CLI | ✅ 已進化 |

### 詳細分析

#### 統一入口：✅ 完全對齊且進化
- tao-of-coding 透過 `orchestrate-skill.sh` 腳本自動路由，搭配 `skill-dispatch.sh` 手動派遣
- Taonix 已進化為 MCP `taonix_hub` 協議級統一入口，從 Shell 腳本升級為結構化的 MCP 工具呼叫

#### 分級調用：🔄 概念類似但實現不同
- tao-of-coding 依模型層級分級（Flash = gemini-3-flash, Pro = gemini-3-pro）
- Taonix 依任務複雜度分級（低/中/高→動態組建 Agent 小隊），不直接綁定模型選擇

#### 無狀態 vs 有狀態：⚠️ 刻意的設計分歧
- tao-of-coding 強調完全無狀態：每次調用提供完整上下文，確保環境潔淨
- Taonix 刻意選擇有狀態架構：透過 Blackboard 共享記憶、EventBus 事件溯源、情感持久化等機制實現跨任務學習與團隊記憶
- **這不是缺陷而是設計抉擇**：Taonix 著重團隊協作與知識累積，犧牲無狀態的簡潔性換取更豐富的協作能力

#### 防遞迴與交付契約：⚠️ Taonix 未涵蓋
- tao-of-coding 的防遞迴三道防線（visited_skills / max_depth / edge type）和交付契約（路徑/驗收/負責人）是其嚴謹的工程實踐
- Taonix 目前依賴 EventBus 的事件驅動流程控制，無顯式的遞迴防護或結構化交付契約

---

## 四、Taonix 獨有的進階能力

以下是 tao-of-coding 範疇之外，Taonix 已實現的進階功能：

| # | 能力 | 說明 | 核心檔案 |
|---|------|------|----------|
| 1 | **EventBus 事件驅動** | 型別化 Schema 驗證的 pub/sub 通訊，所有跨 Agent 通訊皆透過事件 | `ai-engine/lib/event-bus.js` |
| 2 | **Blackboard 心智黑板** | 事實牆 + 推理鏈 + 假說的共享記憶系統 | `memory/blackboard.js` |
| 3 | **共識機制** | 基於 Gossip 協議的全球心智共識 + 投票決策 | `agents/consensus-engine.js` |
| 4 | **成就系統** | 榮譽勳章驅動的 15-20% 調度權重加成 | `ai-engine/lib/achievement-system.js` |
| 5 | **協作默契** | 量化 Agent 間的合作默契分數，自動學習最佳協作模式 | `ai-engine/lib/collaboration-synergy.js` |
| 6 | **工業級沙盒** | 權限控管 + 審計紀錄的安全執行環境 | `skills/sandbox.js` |
| 7 | **Skill 自動生成** | Skill Architect 元進化，根據需求自動生成新技能 | `skills/skill-architect.js` |
| 8 | **情境恢復 + 熱遷移** | 崩潰自癒與跨節點任務遷移 | `ai-engine/lib/context-recovery.js` |
| 9 | **適應性人格** | Agent 依任務情境調整溝通風格 | PersonaAdapter |
| 10 | **情感持久化** | Agent 的情緒狀態跨 session 保留 | Emotional Persistence |
| 11 | **資源治理** | 資源編排 + GC 機制 + 負載可視化 | Resource Orchestrator |
| 12 | **Web 控制台** | 全方位監控 + 協作拓樸圖 + 效能儀表板 | `web-console/` |

---

## 五、已知不一致與改善建議

### 5.1 核心註冊不完整

`agents/init-core-registration.js` 僅自動註冊 5 個 Agent（explorer, coder, tester, oracle, assistant），但系統實際擁有 8 個有完整實作的 Agent。`reviewer`、`designer`、`product` 未被自動註冊。

`MANIFEST.json` 的 `internal_agents` 列出 `["coder", "oracle", "explorer", "reviewer", "designer", "self-healer"]`，遺漏了 `tester`、`assistant`、`product`。

### 5.2 技能 Instructions 空白

所有 13 個技能的 SKILL.md `Instructions` 區塊目前都是空白骨架。tao-of-coding 的 superpowers 擁有完整的步驟指引（如 TDD 三階段、debugging 四階段）。建議參考 tao-of-coding 的內容填充 Taonix 的技能指引。

### 5.3 Librarian 角色缺失

tao-of-coding 的 Librarian 負責文件撰寫、API 註解、i18n 翻譯。Taonix 目前由 Product + doc-generator skill 分擔部分職責，但缺乏 i18n 翻譯和 JSDoc 自動標註的專責處理。

### 5.4 防遞迴機制缺失

tao-of-coding 設計了防遞迴三道防線（visited_skills / max_depth / edge type classification）。Taonix 以事件驅動架構替代，但在 Skill 鏈式調用場景下可能需要類似的保護機制。

---

## 六、總結

### 對齊程度：約 90%

| 維度 | 評估 | 說明 |
|------|------|------|
| 角色系統 | ✅ 超集覆蓋 | 8+ 角色 vs tao-of-coding 的 5 角色 |
| Superpowers 技能 | ✅ 100% 覆蓋 | 8/8 完全覆蓋 + 5 個擴展技能 |
| 統一入口 | ✅ 已進化 | 從 Shell 腳本進化到 MCP Hub 協議 |
| 自動路由 | ✅ 超越 | 三層式路由（意圖→Agent→Skill）|
| 技能內容 | ⚠️ 待填充 | Instructions 骨架已建立但內容空白 |
| Librarian 角色 | ⚠️ 缺失 | 文件/翻譯專家無直接對應 |
| 防遞迴/交付契約 | ⚠️ 缺失 | 以事件驅動替代，但無顯式保護 |
| 設計理念 | 🔄 刻意分歧 | 有狀態（Blackboard）vs 無狀態 |

### 結論

**Taonix 不僅符合 tao-of-coding 的藍圖，還在多個維度上大幅超越。** 核心的角色系統和技能體系已完全覆蓋，統一入口和自動路由更從腳本層級進化到協議層級。Taonix 獨有的 EventBus 事件驅動、Blackboard 心智黑板、共識機制、成就系統等進階能力，使其從「工具集合」進化為真正的「多智能體作業系統」。

主要的改善空間在於：填充技能 Instructions 內容、補齊核心註冊表、以及評估是否需要 Librarian 角色或防遞迴機制。
