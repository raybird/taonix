# Taonix v26.0.0 Runtime Convergence Plan

**Goal**: 將 `taonix` 從概念上完整、但執行鏈分裂的 multi-agent prototype，重構為單一控制面、單一任務契約、可端到端驗證的下一版 runtime。

**Architecture**: `mcp-server/`, `ai-engine/`, `agents/`, `skills/`, `memory/`, `tests/`

**Tech Stack**: Node.js 22, ESM, Commander, MCP SDK, JSON/JSONL state, child_process IPC, vm sandbox

## 1. 版本目標

本版只做五件事，全部都直接服務於「讓一句自然語言真的穩定跑完整條鏈」：

1. 收斂為單一正式入口與單一 routing pipeline。
2. 將 Agent 從 CLI-first 改為 runtime-first，CLI 保留為薄包裝。
3. 將 built-in capabilities 與 skills 分離，不再互相踩線。
4. 修正 Skill Architect 與 sandbox runtime 的契約不一致。
5. 補齊從 `taonix_hub` 到最終結果的端到端測試。

## 2. 非目標

以下項目不納入 v26：

- 新增更多 Agent 人設或世界觀敘事
- 分散式叢集、gossip、跨節點熱遷移的大幅擴充
- 向量資料庫、長期記憶基礎設施重寫
- UI / Web Console 全面翻修

## 3. 目標架構

### 3.1 單一正式執行鏈

```text
taonix_hub
  -> normalizeIntent()
  -> routeTask()
  -> planExecution()
  -> dispatchTask()
  -> collectResult()
  -> formatResponse()
```

### 3.2 核心原則

- `mcp-server` 只做 transport 與 request/response 轉換，不自己做另一套路由。
- `ai-engine` 成為唯一的 orchestration facade。
- `agent-dispatcher` 只接受結構化 `TaskSpec`，不再接受隨意自然語言當 CLI command。
- `skills` 只處理可插拔流程，不攔截已存在的 built-in capabilities。
- `content-generation` 只格式化真實結果，不回 placeholder。

### 3.3 新的資料契約

```js
// ai-engine/lib/task-spec.js
export const TaskSpec = {
  id: "task_123",
  userInput: "請分析目前的 github trending",
  intent: "github_trending",
  capability: "github_trending",
  targetAgent: "explorer",
  args: {
    language: "",
    timeframe: "daily"
  },
  executionMode: "builtin" // builtin | skill | composite
};
```

```js
// agents/explorer/runtime.js
export async function executeTask(taskSpec, context) {
  switch (taskSpec.capability) {
    case "github_trending":
      return getGithubTrending(taskSpec.args.language || "");
    case "web_search":
      return searchWeb(taskSpec.args.query, taskSpec.args.num || 5);
    default:
      throw new Error(`Unsupported capability: ${taskSpec.capability}`);
  }
}
```

## 4. 工作流拆解

### Stream A: Control Plane Convergence

#### A1. 建立 TaskSpec 與 ResultSpec 型別檔

- 建議 Agent: `oracle`
- 依賴: 無
- 檔案:
  - `ai-engine/lib/task-spec.js`
  - `ai-engine/lib/result-spec.js`
- 變更:
  - 定義正式的 task/result JSON 結構。
  - 明確欄位：`intent`, `capability`, `targetAgent`, `args`, `executionMode`, `traceId`。
- 驗證指令:
  ```bash
  node -e "import('./ai-engine/lib/task-spec.js').then(() => console.log('task-spec ok'))"
  ```
- 預期輸出:
  ```text
  task-spec ok
  ```

#### A2. 將 `ai-engine/index.js` 改為唯一執行入口

- 建議 Agent: `coder`
- 依賴: A1
- 檔案:
  - `ai-engine/index.js`
  - `ai-engine/lib/intent-understanding.js`
  - `ai-engine/lib/content-generation.js`
- 變更:
  - `process(input)` 產生 `TaskSpec`。
  - built-in capability 直接進 `agentDispatcher`。
  - skill flow 只在 `executionMode === "skill"` 時觸發。
  - 回傳真實結果，不再回 `"等待 Agent 執行結果..."`。
- 驗證指令:
  ```bash
  node ai-engine/index.js "請分析目前的 github trending"
  ```
- 預期輸出:
  ```text
  結果: { "intent": "github_trending", "content": "...", "result": { ... } }
  ```

#### A3. 簡化 `mcp-server`，禁止再做第二套 AI routing

- 建議 Agent: `coder`
- 依賴: A2
- 檔案:
  - `mcp-server/index.js`
- 變更:
  - `taonix_hub` 只呼叫 `TaonixAI.run()`。
  - 移除 `routingPrompt`。
  - 保留 schema validation 與 transport 包裝。
- 驗證指令:
  ```bash
  node mcp-server/index.js
  ```
- 預期輸出:
  ```text
  服務可啟動，且 tool list 只暴露 taonix_hub
  ```

### Stream B: Agent Contract Stabilization

#### B1. 新增每個 Agent 的 runtime API

- 建議 Agent: `coder`
- 依賴: A1
- 檔案:
  - `agents/explorer/runtime.js`
  - `agents/oracle/runtime.js`
  - `agents/reviewer/runtime.js`
  - `agents/coder/runtime.js`
- 變更:
  - 每個 agent 提供 `executeTask(taskSpec, context)`。
  - CLI `index.js` 僅負責解析命令列後轉呼叫 runtime API。
- 驗證指令:
  ```bash
  node -e "import('./agents/explorer/runtime.js').then(m => console.log(typeof m.executeTask))"
  ```
- 預期輸出:
  ```text
  function
  ```

#### B2. `agent-dispatcher` 改為 runtime-first，CLI fallback

- 建議 Agent: `coder`
- 依賴: B1
- 檔案:
  - `ai-engine/lib/agent-dispatcher.js`
- 變更:
  - 優先直接 `import()` runtime module 執行。
  - CLI child process 保留為 fallback 或 debug mode。
  - `dispatch()` 接受 `TaskSpec`，不再拼 `node agent/index.js <raw natural language>`。
- 驗證指令:
  ```bash
  node tests/test-integration.js
  ```
- 預期輸出:
  ```text
  至少包含 direct runtime dispatch 成功訊息
  ```

#### B3. 修復 event schema 漂移

- 建議 Agent: `reviewer`
- 依賴: 無
- 檔案:
  - `agents/assistant/index.js`
  - `ai-engine/lib/event-schema.js`
  - `ai-engine/lib/event-bus.js`
- 變更:
  - `TASK_ASSIGNED` payload 統一為 `{ taskId, agent, task }`。
  - 加測試確保 schema mismatch 會 fail fast。
- 驗證指令:
  ```bash
  node agents/assistant/index.js broadcast explorer "test task"
  ```
- 預期輸出:
  ```text
  不再出現事件被拒絕
  ```

### Stream C: Capability vs Skill Boundary

#### C1. 建立 built-in capability registry

- 建議 Agent: `oracle`
- 依賴: A1
- 檔案:
  - `ai-engine/lib/capability-registry.js`
  - `ai-engine/lib/intent-understanding.js`
- 變更:
  - 將 `github_trending`, `web_search`, `check_quality` 等列入 built-in registry。
  - intent 分析只決定 capability 與 targetAgent，不直接碰 skill engine。
- 驗證指令:
  ```bash
  node -e "import('./ai-engine/lib/capability-registry.js').then(m => console.log(m.listCapabilities().length))"
  ```
- 預期輸出:
  ```text
  大於 0 的內建能力數
  ```

#### C2. skill engine 只處理「未知但可程式化」需求

- 建議 Agent: `coder`
- 依賴: C1
- 檔案:
  - `skills/index.js`
  - `skills/matcher.js`
- 變更:
  - 若 capability 已存在，直接 return built-in。
  - 只有 `intent === "unknown"` 或 `executionMode === "skill"` 才允許 Skill Architect 啟動。
- 驗證指令:
  ```bash
  node ai-engine/index.js "請分析目前的 github trending"
  ```
- 預期輸出:
  ```text
  不再出現「未找到匹配技能，啟動元進化引擎」
  ```

### Stream D: Skill Runtime Repair

#### D1. 修正 Skill Architect 產出格式

- 建議 Agent: `coder`
- 依賴: 無
- 檔案:
  - `skills/skill-architect.js`
- 變更:
  - 不再要求 AI 輸出 ESM `export` 字串。
  - 改為輸出可 eval 的工廠函式格式，例如：
  ```js
  ({
    async execute(ctx) {
      return { success: true };
    }
  })
  ```
- 驗證指令:
  ```bash
  node -e "import('./skills/skill-architect.js').then(() => console.log('skill-architect ok'))"
  ```
- 預期輸出:
  ```text
  skill-architect ok
  ```

#### D2. sandbox 支援明確的 module contract

- 建議 Agent: `coder`
- 依賴: D1
- 檔案:
  - `skills/sandbox.js`
- 變更:
  - `run()` 執行後驗證回傳物件是否具備 `execute()`。
  - 將 `policy` 從 instance-level 改為 per-run options，避免共享狀態污染。
- 驗證指令:
  ```bash
  node -e "import('./skills/sandbox.js').then(async ({skillSandbox}) => { const r = await skillSandbox.run('({ execute: async () => ({ ok: true }) })', {}); console.log(typeof r.execute); })"
  ```
- 預期輸出:
  ```text
  function
  ```

#### D3. remote loader / generated skill 與 registry 契約對齊

- 建議 Agent: `reviewer`
- 依賴: D2
- 檔案:
  - `skills/remote-loader.js`
  - `skills/registry.js`
- 變更:
  - 產生與載入同一種 skill shape。
  - 新裝 skill 必須能被 `loadSkills()` 立即讀到並執行。
- 驗證指令:
  ```bash
  node -e "import('./skills/index.js').then(async m => { const e = await m.createSkillEngine(); console.log(e.getSkills().length); })"
  ```
- 預期輸出:
  ```text
  技能清單可正常載入
  ```

### Stream E: Tests, Traceability, Release Gate

#### E1. 重寫整合測試為真實 user flows

- 建議 Agent: `tester`
- 依賴: A3, B2, C2
- 檔案:
  - `tests/test-integration.js`
  - `tests/fixtures/`
- 變更:
  - 新增至少 4 條主流程：
    - github trending
    - web search
    - structure analysis
    - code quality review
  - 每條都從 `TaonixAI.run()` 或 `taonix_hub` 打入。
- 驗證指令:
  ```bash
  node tests/test-integration.js
  ```
- 預期輸出:
  ```text
  所有端到端流程通過
  ```

#### E2. 新增 golden response 測試

- 建議 Agent: `tester`
- 依賴: E1
- 檔案:
  - `tests/golden/*.json`
- 變更:
  - 固定比對回傳 shape，不比對易漂移文字全文。
  - 驗證欄位：`intent`, `agent`, `result`, `status`, `traceId`。
- 驗證指令:
  ```bash
  node tests/test-integration.js
  ```
- 預期輸出:
  ```text
  golden schema assertions passed
  ```

#### E3. 加入 release gate 清單

- 建議 Agent: `assistant`
- 依賴: E1, E2
- 檔案:
  - `docs/RELEASE-V26.md`
- 變更:
  - 定義 v26 發版條件：
    - 所有主流程通過
    - 不再出現 placeholder content
    - 不再誤觸 skill auto-generation
    - event schema 無拒收
    - 至少一條 generated skill happy path 通過
- 驗證指令:
  ```bash
  rg -n "等待 Agent 執行結果|未找到匹配技能，啟動元進化引擎" .
  ```
- 預期輸出:
  ```text
  僅保留文件或測試 fixture 中的字樣
  ```

## 5. 執行順序

### 必須循序

1. A1
2. A2
3. A3
4. B1
5. B2
6. C1
7. C2
8. D1
9. D2
10. D3
11. E1
12. E2
13. E3

### 可平行

- B3 可與 C1 平行
- D1 可與 C1 平行
- E3 可在 E1 之後先起草

## 6. 風險與緩解

| 風險 | 影響 | 緩解 |
|---|---|---|
| 直接 runtime import 後，部分 agent 還依賴 CLI side effects | dispatch 失敗 | 先保留 CLI fallback，一個 agent 一個 agent 遷移 |
| 舊測試依賴 stdout 文案 | 測試大量破裂 | 改為驗證結構化 payload |
| `AICaller` 外部依賴不穩定 | validator / architect 偶發失敗 | v26 對 routing 採 deterministic first |
| 黑板持久化仍是檔案式 | 高併發下可能競態 | v26 先接受，v27 再考慮 store 抽象 |

## 7. 驗收標準

- 使用者透過 `taonix_hub` 提出 `github trending` 類請求時，會走 built-in capability，不會進 Skill Architect。
- `TaonixAI.run()` 與 `taonix_hub` 對同一輸入返回相同 routing 結果。
- 所有主流程回應都包含真實執行結果，不含 placeholder。
- 事件 payload 全部符合 schema。
- generated skill 至少能完成一次 sandbox 驗證與載入。

## 8. 執行方式

### 同步執行

- 以本計畫為 backlog，按 Stream A -> E 逐批重構。
- 每批完成後跑一次 `node tests/test-integration.js`。

### 非同步分派

- `oracle`: A1, C1
- `coder`: A2, A3, B1, B2, C2, D1, D2
- `reviewer`: B3, D3
- `tester`: E1, E2
- `assistant`: E3, 發版檢查

## 9. 第一批建議立即開工項目

如果只先做一批，建議先做這 4 件：

1. A1 `TaskSpec`
2. A2 收斂 `ai-engine`
3. A3 簡化 `mcp-server`
4. C2 禁止 built-in capability 誤觸 skill auto-generation

這一批做完，`taonix` 的「一句話進來卻跑錯鏈」問題會先被壓下來，後面再補 agent runtime 與 skill sandbox。
