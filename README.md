# Taonix v26.0.0

> 事件驅動的多智能體 AI 作業系統

Taonix 是一個以單一入口 `taonix_hub` 為核心的 multi-agent runtime。外部透過 MCP 或 `ai-engine` 丟自然語言意圖進來，內部再走 `intent-understanding -> TaskSpec -> runtime-first agent dispatch / skill execution -> result`。

## 5 分鐘上手

### AI Agent 最短路徑

如果你是 AI agent，要先確認這個 repo 能不能跑，照下面做：

1. 安裝依賴
```bash
npm install
```

2. 驗證環境
```bash
node tests/test-integration.js
```

3. 本地直接執行一個意圖
```bash
node ai-engine/index.js "分析這個專案的架構"
```

4. 若要提供給 MCP client 使用，再啟動 MCP server
```bash
node mcp-server/index.js
```

只要第 2 步看到 `🏆 所有整合測試通過！`，就代表這個 repo 目前可用。

### 常用入口

| 入口 | 用途 | 指令 |
|------|------|------|
| `ai-engine/index.js` | 本地直接執行自然語言意圖 | `node ai-engine/index.js "你的意圖"` |
| `mcp-server/index.js` | 暴露 `taonix_hub` MCP 工具 | `node mcp-server/index.js` |
| `tests/test-integration.js` | 驗證 runtime 與 user flows | `node tests/test-integration.js` |
| `web-console/server.js` | 啟動本地 Web console | `node web-console/server.js` |

## 系統需求

- Node.js `>=22`
- ESM 環境
- 可選 AI CLI provider：
  - `opencode`
  - `gemini`
  - `codex`
  - `ollama`

## 安裝

```bash
git clone <repo-url> taonix
cd taonix
npm install
```

`npm install` 會自動透過 `postinstall` 安裝 `mcp-server/` 所需依賴。其餘子模組為零外部依賴。

## AI Provider 設定

`taonix` 目前不使用專案內的 `ai-config.yaml`。正式設定來源是：

- 環境變數
- `AICaller` 建構參數
- `AICaller.call(..., { cliArgs })`

常見設定：

```bash
export TAONIX_AI_PROVIDER=opencode
```

```bash
export TAONIX_AI_PROVIDER=gemini
export TAONIX_AI_MODEL=flash
```

```bash
export TAONIX_AI_PROVIDER=codex
export TAONIX_AI_MODEL=gpt-5
```

Provider 對應 CLI：

| Provider | CLI 形式 |
|----------|----------|
| `opencode` | `opencode run` |
| `gemini` | `gemini "<prompt>"` |
| `codex` | `codex exec "<prompt>"` |
| `ollama` | `ollama run <model>` |

### 給 Claude / Codex / Gemini Agent 的建議用法

如果你是外部 AI agent，要先確認 repo 可執行，再開始做事：

```bash
npm install
node tests/test-integration.js
node ai-engine/index.js "分析這個專案的架構"
```

如果你是透過 MCP 接入：

```bash
node mcp-server/index.js
```

然後只使用單一工具：

- `taonix_hub`

建議不要把 `ai-config.yaml` 當成這個 repo 的正式設定來源；目前正式來源是環境變數與 `AICaller` 參數。

## MCP 使用

啟動：

```bash
node mcp-server/index.js
```

MCP client 設定：

```json
{
  "mcpServers": {
    "taonix": {
      "command": "node",
      "args": ["/path/to/taonix/mcp-server/index.js"]
    }
  }
}
```

對外只暴露單一工具：

- `taonix_hub`

輸入格式：

```json
{
  "intent": "分析這個專案的架構"
}
```

## AI Engine 使用

```bash
node ai-engine/index.js "幫我分析這個專案的架構"
```

預期輸出是一個 JSON 結果，至少包含：

- `intent`
- `agent`
- `taskSpec`
- `result`
- `content`

## 常見驗證指令

```bash
node ai-engine/index.js "請分析目前的 github trending"
node ai-engine/index.js "幫我搜索一下 AI 的最新新聞"
node ai-engine/index.js "分析這個專案的架構"
node ai-engine/index.js "檢查這個專案的代碼品質"
```

注意：

- `github_trending` 依賴外部網路；若環境無法外連，會回 `fetch failed`
- `web_search` 目前是 stub search result，不是實際搜尋 API

## 架構摘要

```text
使用者意圖
  -> taonix_hub
  -> TaonixAI.run()
  -> intent-understanding
  -> TaskSpec
  -> runtime-first agent dispatch / skill execution
  -> content-generation
  -> 結果
```

核心模組：

- `ai-engine/lib/task-spec.js`: 正式任務契約
- `ai-engine/lib/result-spec.js`: 正式結果契約
- `ai-engine/lib/capability-registry.js`: built-in capability registry
- `ai-engine/lib/agent-dispatcher.js`: runtime-first dispatch，CLI fallback
- `skills/sandbox.js`: skill sandbox
- `tests/test-integration.js`: 整合測試與真實 user flow 驗證

## 目錄結構

```text
taonix/
├── agents/        # Agent CLI 與 runtime modules
├── ai-engine/     # 核心 AI 引擎
├── config/        # 路徑與系統設定
├── docs/          # 技術文件 / 計畫 / 發版清單
├── integration/   # TeleNexus 整合
├── mcp-server/    # MCP 統一入口
├── memory/        # Blackboard / learning / intent library
├── planning/      # 規劃引擎
├── skills/        # 技能框架與 agentskills
├── tests/         # 整合測試 / golden fixtures
├── tools/         # 內部工具模組
└── web-console/   # Web console
```

## 相關文件

| 文件 | 用途 |
|------|------|
| `docs/README.md` | 技術深潛指南 |
| `docs/CHANGELOG.md` | 版本變更紀錄 |
| `docs/RELEASE-V26.md` | v26 發版驗收 |
| `docs/plans/2026-03-06-taonix-v26-runtime-convergence.md` | 本輪重構計畫 |
| `docs/AGENTS.md` | Agent 團隊手冊 |
| `SOUL.md` | 系統哲學 |

## License

MIT
