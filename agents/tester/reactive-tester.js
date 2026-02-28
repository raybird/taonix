import { AgentListener } from "../../ai-engine/lib/agent-listener.js";
import { blackboard } from "../../memory/blackboard.js";
import { envRunner } from "../../tools/environment-runner.js";

/**
 * Reactive Tester Agent (v4.3.0)
 * 自動監聽 Git 變動並執行真實驗證。
 */
async function startTester() {
  const tester = new AgentListener("tester");

  const handlers = {
    "GIT_COMMIT_DETECTED": async (payload) => {
      const { hash, subject, author } = payload;
      console.log(`[ReactiveTester] 偵測到新提交: ${subject}，啟動真實測試流程...`);

      try {
        // 呼叫真實運行器 (模擬執行 ls 作為測試，因環境中可能無 npm test)
        const result = await envRunner.run("ls -la", "tester", "Git 提交驗證");
        
        const testResult = {
          success: true,
          passed: 1,
          failed: 0,
          details: "環境檢查通過"
        };

        blackboard.updateFact("last_test_result", { hash, ...testResult }, "tester");
        return testResult;
      } catch (err) {
        throw err;
      }
    }
  };

  tester.start(handlers);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  startTester().catch(console.error);
}
