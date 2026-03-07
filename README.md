# Taonix v27

Taonix 已從 v26 的 multi-agent 敘事系統收斂為一個可安裝、可執行、可測試、可嵌入的 AI task runtime。

## Positioning

- 單一入口：`run(input, options)` / `runTask(taskSpec, options)`
- 明確契約：`TaskSpec` / `ResultSpec` / `CapabilitySpec` / `EventSpec`
- runtime-first execution，child-process 只作 fallback
- plugin / capability 可擴充
- 具備 telemetry / traceability
- 對外透過 CLI 與 MCP 暴露

## Quick Start

```bash
npm install
npm test
node src/interfaces/cli/index.js run "分析這個專案的架構"
node src/interfaces/cli/index.js capabilities
```

啟動 MCP server:

```bash
node src/interfaces/mcp/stdio.js
```

## CLI

```bash
taonix run "分析這個 repo 結構"
taonix task --file ./task.json
taonix capabilities
taonix doctor
```

`task.json` 範例：

```json
{
  "id": "task_demo",
  "traceId": "trace_demo",
  "capability": "check_quality",
  "args": {
    "filepath": "package.json"
  }
}
```

## MCP

對外只暴露單一穩定工具 `taonix_hub`。

MCP client 設定：

```json
{
  "mcpServers": {
    "taonix": {
      "command": "node",
      "args": ["/path/to/taonix/src/interfaces/mcp/stdio.js"]
    }
  }
}
```

呼叫範例：

```json
{
  "intent": "分析這個專案的架構"
}
```

或傳入結構化 task：

```json
{
  "task": {
    "id": "task_demo",
    "traceId": "trace_demo",
    "capability": "analyze_structure",
    "args": {
      "directory": "."
    }
  }
}
```

## Architecture

```text
src/
  core/
    contracts/
    plugins/
    runtime/
    telemetry/
  capabilities/
    analyze-structure/
    check-quality/
    web-search/
    github-trending/
  interfaces/
    cli/
    mcp/
```

核心入口：

- `src/core/runtime/index.js`
- `src/interfaces/cli/index.js`
- `src/interfaces/mcp/index.js`
- `src/interfaces/mcp/stdio.js`

## Migration

- `docs/migration/v26-runtime-refactor-phase-1.md`
- `docs/migration/v26-runtime-refactor-phase-2.md`

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

核心測試不依賴外網。`github_trending` 必須透過注入 context 或 mock 測試。

目前 repo 已收斂為純 `src/` v27 runtime，舊 compatibility 與 legacy runtime 殼層已移除。

## Non-goals

- 不再把人格化 agent 敘事當核心執行模型
- 不再把 blackboard、榮譽值、自評分當 runtime 必要依賴
- 不再把 skill auto-generation 與外網能力當主要驗證線
