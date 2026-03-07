# Taonix Runtime Guide

這份文件描述目前有效的 v27 runtime 架構，不再把 multi-agent 敘事、blackboard、榮譽系統或技能自生成視為核心執行模型。

## What It Is

Taonix 現在是一個 AI task runtime，提供：

- 單一統一入口
- 穩定的 `TaskSpec` / `ResultSpec` 契約
- runtime-first execution
- 明確 capability registry
- 可替換 telemetry sink
- 薄 CLI 與薄 MCP 介面

## Entrypoints

- [src/core/runtime/index.js](/home/raybird/Documents/RCodes/taonix/src/core/runtime/index.js)
- [src/interfaces/cli/index.js](/home/raybird/Documents/RCodes/taonix/src/interfaces/cli/index.js)
- [src/interfaces/mcp/index.js](/home/raybird/Documents/RCodes/taonix/src/interfaces/mcp/index.js)
- [stdio.js](/home/raybird/Documents/RCodes/taonix/src/interfaces/mcp/stdio.js)

## Core Flow

```text
input
  -> router.normalize
  -> router.route
  -> TaskSpec
  -> dispatcher
  -> in-process capability handler
  -> child-process fallback if needed
  -> ResultSpec
  -> telemetry sink
```

所有自然語言與結構化 task 都必須走同一條 pipeline。

## Contracts

位置：

- [task-spec.js](/home/raybird/Documents/RCodes/taonix/src/core/contracts/task-spec.js)
- [result-spec.js](/home/raybird/Documents/RCodes/taonix/src/core/contracts/result-spec.js)
- [capability-spec.js](/home/raybird/Documents/RCodes/taonix/src/core/contracts/capability-spec.js)
- [event-spec.js](/home/raybird/Documents/RCodes/taonix/src/core/contracts/event-spec.js)

主要欄位：

- Task: `id`, `traceId`, `capability`, `input`, `args`, `target`, `executionMode`, `status`, `meta`
- Result: `taskId`, `traceId`, `capability`, `executionMode`, `status`, `success`, `data`, `error`, `meta`

## Capabilities

目前預設註冊：

- [analyze-structure](/home/raybird/Documents/RCodes/taonix/src/capabilities/analyze-structure/index.js)
- [check-quality](/home/raybird/Documents/RCodes/taonix/src/capabilities/check-quality/index.js)
- [web-search](/home/raybird/Documents/RCodes/taonix/src/capabilities/web-search/index.js)
- [github-trending](/home/raybird/Documents/RCodes/taonix/src/capabilities/github-trending/index.js)

capability 必須顯式註冊，且可以單獨測試。

## Child Process Protocol

位置：

- [child-protocol.js](/home/raybird/Documents/RCodes/taonix/src/core/runtime/child-protocol.js)

目前支援：

- 新 sentinel: `__TAONIX_CHILD_RESULT__`
- legacy sentinel: `__TAONIX_RESULT__`

這是 migration 相容設計，不代表 legacy agent CLI 仍是推薦執行路徑。

## CLI

```bash
taonix run "分析這個 repo 結構"
taonix task --file task.json
taonix capabilities
taonix doctor
```

CLI 不自行 routing 第二套邏輯，只調用 runtime API。

## MCP

MCP 只暴露單一工具 `taonix_hub`。

可接受：

- `{ "intent": "..." }`
- `{ "task": { ...TaskSpec } }`

MCP 不自行維護第二套 router。

## Testing

```bash
npm test
node tests/test-integration.js
```

測試分層：

- contracts
- runtime
- capabilities
- integration
- e2e

核心測試可在無外網環境下通過。`github_trending` 必須以注入 context 或 mock 測試。

## Migration Notes

- [v26-runtime-refactor-phase-1.md](/home/raybird/Documents/RCodes/taonix/docs/migration/v26-runtime-refactor-phase-1.md)
- [v26-runtime-refactor-phase-2.md](/home/raybird/Documents/RCodes/taonix/docs/migration/v26-runtime-refactor-phase-2.md)

## Deprecated Runtime Concepts

以下概念仍存在於 repo 的某些 legacy 模組，但不屬於核心 runtime：

- blackboard
- persona-adapter
- achievement / honor scoring
- consensus / p2p / self-healing
- skill auto-generation default flow

它們若保留，只能作為非核心、非預設、可刪除的歷史遺留。

## Legacy Areas

目前有效架構已收斂到 `src/`。migration note 保留於 `docs/migration/`，作為重構歷史記錄。
