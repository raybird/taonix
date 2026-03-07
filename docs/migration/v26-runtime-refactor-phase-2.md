# Taonix Runtime Refactor Phase 2

## Phase

Phase 2 to 5 bridge: compatibility cleanup, child-process protocol formalization, and docs stabilization.

## What Changed

- `ai-engine/lib/task-spec.js` now delegates to `src/core/contracts/task-spec.js`
- `ai-engine/lib/result-spec.js` now delegates to `src/core/contracts/result-spec.js`
- `ai-engine/lib/intent-understanding.js` now delegates routing to `src/core/runtime/router.js`
- `ai-engine/lib/agent-dispatcher.js` now delegates execution to `src/core/runtime/index.js`
- `agents/lib/ipc-output.js` now uses shared child protocol helpers
- `src/core/runtime/dispatcher.js` accepts both new sentinel `__TAONIX_CHILD_RESULT__` and legacy sentinel `__TAONIX_RESULT__`

## Why

- Remove duplicated routing and dispatch logic from legacy core modules
- Keep old entry points callable while forcing execution through the new runtime boundary
- Preserve child-process fallback compatibility during migration without letting legacy IPC shape define the new core

## Legacy To New Mapping

- `ai-engine/index.js` -> `src/core/runtime/index.js`
- `ai-engine/lib/intent-understanding.js` -> `src/core/runtime/router.js`
- `ai-engine/lib/agent-dispatcher.js` -> `src/core/runtime/dispatcher.js`
- `agents/lib/ipc-output.js` -> `src/core/runtime/child-protocol.js`
- `mcp-server/index.js` -> `src/interfaces/mcp/index.js`

## Remaining Removal Candidates

- `memory/blackboard.js` and its transitive runtime dependencies
- `ai-engine/lib/achievement-system.js`
- `ai-engine/lib/arbitrator.js`
- `ai-engine/lib/consensus-manager.js`
- `ai-engine/lib/peer-discovery.js`
- `ai-engine/lib/p2p-bridge.js`
- `skills/skill-architect.js` as default execution path

## Validation

- `npm test`
- `node tests/test-integration.js`
- `node src/interfaces/cli/index.js run "請檢查 package.json 品質"`
- `node -e "import('./src/interfaces/mcp/index.js').then(async ({ createMcpHub }) => { const hub = await createMcpHub(); const r = await hub.callTool('taonix_hub', { intent: '分析這個專案的架構' }); console.log(r.result.success); })"`
