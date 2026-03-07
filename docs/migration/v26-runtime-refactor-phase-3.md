# Taonix Runtime Refactor Phase 3

## Phase

Legacy distributed-control cleanup.

## What Changed

- Neutralized legacy runtime-adjacent modules into compatibility shims:
  - `achievement-system`
  - `arbitrator`
  - `consensus-manager`
  - `gossip-consensus`
  - `peer-discovery`
  - `p2p-bridge`
- These modules now preserve import compatibility but no longer:
  - subscribe to event buses
  - write blackboard state
  - create timers or background loops
  - participate in core task execution

## Why

- They added unstable background behavior without belonging to the current runtime contract.
- Keeping their old behavior would reintroduce hidden side effects and flaky verification paths.
- Removing them outright would still break legacy imports, so compatibility shims are the safer intermediate state.

## Validation

- `npm test`
- `node tests/test-integration.js`
- new runtime tests for legacy shims

## Phase 4 Cleanup Follow-Up

After shim validation, the following modules were physically removed because they had no remaining runtime callers:

- `ai-engine/lib/achievement-system.js`
- `ai-engine/lib/arbitrator.js`
- `ai-engine/lib/consensus-manager.js`
- `ai-engine/lib/gossip-consensus.js`
- `ai-engine/lib/peer-discovery.js`
- `ai-engine/lib/p2p-bridge.js`
- `ai-engine/lib/task-migration.js`
- `ai-engine/lib/resource-orchestrator.js`
- `ai-engine/lib/self-optimizer.js`
- `agents/self-healing-agent.js`
- `agents/coder/reactive-coder.js`
- `agents/tester/reactive-tester.js`
- `agents/assistant/long-task-orchestrator.js`
- `ai-engine/lib/persona-adapter.js`
- `ai-engine/lib/collaboration-culture.js`
- `ai-engine/lib/priority-manager.js`
- `ai-engine/lib/distributed-event-bus.js`
- `ai-engine/lib/task-state-machine.js`
- `ai-engine/lib/agent-listener.js`
- `ai-engine/lib/synergy-engine.js`
- `party/`
- `planning/`

## Remaining Legacy Areas

- `agents/assistant/index.js`
- `agents/lib/base-agent.js`
- `memory/`
- `skills/`
