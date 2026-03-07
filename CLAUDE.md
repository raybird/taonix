# CLAUDE.md

本文件描述目前 Taonix repo 的有效工作方式。若與舊文件衝突，以 `src/` 下的 v27 runtime 實作為準。

## 專案定位

Taonix 現在是 AI task runtime，不是以人格化 multi-agent 敘事為核心的系統。

核心原則：

- 單一入口
- 穩定 `TaskSpec` / `ResultSpec`
- runtime-first execution
- 顯式 capability registry
- telemetry 為附屬設施
- CLI / MCP 都是薄介面

## 主要入口

```bash
# 正式 CLI 入口
node src/interfaces/cli/index.js capabilities
node src/interfaces/cli/index.js run "檢查 package.json 品質"

# 正式 MCP stdio 入口
node src/interfaces/mcp/stdio.js

# 測試
npm test
node tests/test-integration.js
```

## 有效架構

主執行路徑：

`input -> router -> TaskSpec -> dispatcher -> capability handler -> ResultSpec -> telemetry`

主要程式位置：

- `src/core/contracts/`
- `src/core/runtime/`
- `src/core/plugins/`
- `src/core/telemetry/`
- `src/capabilities/`
- `src/interfaces/cli/`
- `src/interfaces/mcp/`

## Runtime Boundary

目前 repo 以 `src/` 為唯一有效執行路徑。

- 不要重建 `ai-engine/`、`agents/`、`memory/`、`skills/` 類 legacy 邊界
- capability 實作應直接放在 `src/capabilities/`
- CLI / MCP 入口都應留在 `src/interfaces/`

## 開發規範

- 新功能優先落在 `src/`
- 不要新增人格化 agent 敘事、blackboard 依賴或榮譽值機制到核心路徑
- capability 必須顯式註冊，且可單測
- 核心測試必須可在無外網環境下通過
- 外網能力要可 mock

## 文件

- `README.md`：v27 對外說明
- `docs/README.md`：runtime guide
- `docs/migration/v26-runtime-refactor-phase-1.md`
- `docs/migration/v26-runtime-refactor-phase-2.md`
- `docs/migration/v26-runtime-refactor-phase-3.md`
