# Taonix Runtime Roles

這份文件只描述 v27 仍然有效的角色邊界，不再把人格化 agent 團隊視為核心架構。

## Core Runtime

### Router

- responsibility: 將自然語言或結構化輸入轉成正式 `TaskSpec`
- implementation: `src/core/runtime/router.js`

### Dispatcher

- responsibility: 執行正式 `TaskSpec`
- rule: in-process first, child-process fallback
- implementation: `src/core/runtime/dispatcher.js`

### Capability

- responsibility: 顯式註冊、可單測的功能模組
- implementation: `src/capabilities/*`

### Telemetry

- responsibility: 記錄 task / trace / event
- implementation: `src/core/telemetry/*`

## Capability Runtime

能力模組直接位於 `src/capabilities/*`：

- `analyze-structure`
- `check-quality`
- `web-search`
- `github-trending`

不要再透過 `agents/*` 或其他間接殼層承載 capability 實作。

## Removed Legacy Concepts

以下概念已不再屬於核心系統：

- arbitrator
- self-healer
- achievement / honor driven dispatch
- gossip / p2p / mesh consensus
- skill architect as default runtime path

若未來要重新引入，必須以正式 contracts、測試與明確呼叫路徑重建。
