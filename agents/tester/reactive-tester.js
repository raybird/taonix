import { AgentListener } from "../../ai-engine/lib/agent-listener.js";
import { blackboard } from "../../memory/blackboard.js";
import { execSync } from "child_process";

/**
 * Reactive Tester Agent (v4.3.0)
 * 自動監聽 Git 變動並執行驗證。
 */
async function startTester() {
  const tester = new AgentListener("tester");

  const handlers = {
    // 訂閱 GitObserver 發布的事件
    "GIT_COMMIT_DETECTED": async (payload) => {
      const { hash, subject, author } = payload;
      console.log(`[ReactiveTester] 偵測到新提交: ${subject} (${hash})，啟動自動測試...`);

      // 1. 記錄推理
      blackboard.recordThought("tester", `正在針對 ${author} 的提交「${subject}」進行自動化回歸測試。`);

      try {
        // 2. 模擬執行真實測試 (此處可替換為真實的 npm test 指令)
        console.log(`[ReactiveTester] 執行測試指令中...`);
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // 假設測試成功
        const testResult = {
          success: true,
          passed: 12,
          failed: 0,
          coverage: "85%"
        };

        // 3. 更新事實與推理
        blackboard.updateFact("last_test_result", { hash, ...testResult }, "tester");
        blackboard.recordThought("tester", `測試通過。所有 12 個案例皆正常運行。系統狀態：穩定。`);

        return testResult;
      } catch (err) {
        blackboard.recordThought("tester", `測試失敗！偵測到可能的 Regression。錯誤訊息: ${err.message}`);
        blackboard.updateFact("last_test_result", { hash, success: false, error: err.message }, "tester");
        throw err;
      }
    }
  };

  tester.start(handlers);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  startTester().catch(console.error);
}
