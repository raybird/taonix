# Taonix v26 Release Gate

## Goal

確認 `taonix` 是否已達到 v26「Runtime Convergence」版本的發版標準。

## Scope

本次 release gate 僅涵蓋以下範圍：

- 單一控制面收斂
- runtime-first agent dispatch
- built-in capability 與 skill 邊界切開
- skill runtime contract 修復
- 真實 user flow 整合測試
- AI CLI provider 支援 `opencode` / `gemini` / `codex` / `ollama`

以下項目明確不在本次 gate 範圍內：

- `ai-config.yaml` 設定檔整合
- Web Console / UI 收尾
- 分散式叢集與 gossip 類能力
- 完整的外部網路穩定性保證

## Release Criteria

| Criterion | Status | Notes |
|---|---|---|
| `taonix_hub` 走單一入口，不再自建第二套路由 | PASS | `mcp-server` 直接委派 `TaonixAI.run()` |
| `TaonixAI.run()` 會回真實結果，不再回 placeholder | PASS | `content-generation` 改為格式化 execution result |
| built-in capability 不再誤觸 skill auto-generation | PASS | `github_trending` / `web_search` / `analyze_structure` 已驗證 |
| `agent-dispatcher` 優先走 runtime module | PASS | runtime-first，CLI fallback 保留 |
| `TASK_ASSIGNED` event payload 符合 schema | PASS | Assistant broadcast 已修正 |
| Skill sandbox 可驗證新格式 skill module | PASS | object expression / `export default` 皆可 |
| standard skill 可透過新 sandbox path 執行 | PASS | `writing-plans` 已驗證 |
| `AICaller` 支援 `opencode` / `gemini` / `codex` / `ollama` | PASS | `gemini` 已調整為官方 positional prompt 形式 |
| 呼叫端可傳 provider-specific CLI 參數 | PASS | `AICaller.call(..., { cliArgs: [...] })` |
| 端到端整合測試包含真實 user flows | PASS | 新增 golden flow shape fixtures |
| 所有整合測試通過 | PASS | `node tests/test-integration.js` 全綠 |

## Verification Evidence

### Core commands

```bash
node tests/test-integration.js
```

預期：

```text
🏆 所有整合測試通過！
```

### AI flow coverage

目前已納入整合測試的真實 user flows：

- `請分析目前的 github trending`
- `幫我搜索一下 AI 的最新新聞`
- `分析這個專案的架構`
- `檢查這個專案的代碼品質`

對應 fixture：

- `tests/golden/ai-engine-flow-shapes.json`

### Skill runtime coverage

已驗證：

- sandbox 可執行 object-expression skill module
- sandbox 可相容 `export default { ... }`
- standard skill `writing-plans` 可正常經過 skill engine 執行

## Known Risks

| Risk | Severity | Notes |
|---|---|---|
| `github_trending` 依賴外部網路，離線或受限環境會回 `fetch failed` | Medium | 架構已正確，外部連線不保證 |
| `AICaller` 仍仰賴外部 CLI 可用性與登入狀態 | Medium | 屬於執行環境風險，不是 runtime contract 風險 |
| `gemini` / `codex` 不同版本 CLI 旗標可能演進 | Low | 目前已按已知官方/本機 help 對齊 |
| 測試仍以 shape 驗證為主，未做全文 golden text 比對 | Low | 這是刻意設計，避免易碎測試 |

## Decision

**Decision: PASS**

`taonix` 已達到 v26 發版條件，可以視為「Runtime Convergence」版本成立。

## Recommended Next Steps

### 若要立即發版

- 整理 commit / tag
- 更新 README 中對 AI CLI provider 的說明
- 將 `docs/RELEASE-V26.md` 作為發版附帶文件

### 若要繼續做 v26.x

- 補 `README` 中的 provider 設定範例
- 新增更多 golden flow fixtures
- 將 `github_trending` 的外部 fetch 錯誤轉成更清楚的 user-facing 訊息
- 視需求再決定是否引入正式配置層，但不使用 `ai-config.yaml`
