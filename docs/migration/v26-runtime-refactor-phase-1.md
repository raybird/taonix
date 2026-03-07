# Taonix Runtime Refactor Phase 1

## Phase

Phase 1: inventory, boundary definition, and minimum viable runtime skeleton.

## Keep

- `agents/oracle/lib/structure-analyzer.js`
- `agents/reviewer/lib/quality-checker.js`
- `agents/explorer/lib/web-search.js`
- `agents/explorer/lib/github-trending.js`
- `agents/*/runtime.js` as temporary adapters
- existing MCP package dependency and root commander dependency

## Refactor

- `ai-engine/index.js` -> compatibility wrapper over `src/core/runtime`
- `mcp-server/index.js` -> compatibility wrapper over `src/interfaces/mcp`
- capability registry / task spec / result spec -> move into `src/core/contracts` and `src/core/plugins`
- routing / dispatch -> move into `src/core/runtime`
- telemetry -> isolated under `src/core/telemetry`

## Remove Or Marginalize

- `memory/blackboard.js` from core execution path
- personality and honor driven logic in `ai-engine/lib/agent-dispatcher.js`
- achievement, arbitration, consensus, p2p, self-healing, evolution flows from default runtime
- skill auto-generation as default execution path
- semantic validation coupled to old intent templates

## New Directory Structure

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
tests/
  contracts/
  runtime/
  capabilities/
  integration/
  e2e/
```

## Migration Mapping

- v26 `intent-understanding.js` -> `src/core/runtime/router.js`
- v26 `task-spec.js` -> `src/core/contracts/task-spec.js`
- v26 `result-spec.js` -> `src/core/contracts/result-spec.js`
- v26 `capability-registry.js` -> `src/core/plugins/registry.js`
- v26 `agent-dispatcher.js` -> `src/core/runtime/dispatcher.js`
- v26 built-in executor -> explicit capabilities under `src/capabilities/*`
- v26 MCP server -> `src/interfaces/mcp/index.js`

## Risks Still Open

- `github_trending` still touches external network unless a mock context is injected
- child-process fallback protocol is defined, but not yet migrated across all legacy agents
- old modules still exist and can drift until later phases delete them

## Validation

- new contract tests
- router and dispatcher tests
- capability tests with injected mocks for networked capability
- CLI and MCP smoke tests
