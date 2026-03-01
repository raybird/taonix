import { agentDispatcher } from "../ai-engine/lib/agent-dispatcher.js";
import { blackboard } from "../memory/blackboard.js";
import { eventBus } from "../ai-engine/lib/event-bus.js";

/**
 * Taonix v14.1.0 整合測試腳本
 * 驗證全角色實體化後的端到端執行與黑板聯動。
 */
async function runIntegrationTest() {
  console.log("🧪 啟動 Taonix v14.1.0 全系統整合測試...");

  const testResults = [];

  // 1. 測試 Oracle (架構分析)
  console.log("
[Step 1] 測試 Oracle 實體化執行...");
  const oracleRes = await agentDispatcher.dispatch({
    agent: "oracle",
    task: "structure",
    params: { directory: "." }
  });
  testResults.push({ name: "Oracle Execution", success: oracleRes.success });

  // 2. 測試 Reviewer (品質檢查)
  console.log("
[Step 2] 測試 Reviewer 實體化執行...");
  const reviewerRes = await agentDispatcher.dispatch({
    agent: "reviewer",
    task: "quality",
    params: { filepath: "agents/lib/base-agent.js" }
  });
  testResults.push({ name: "Reviewer Execution", success: reviewerRes.success });

  // 3. 驗證黑板事實更新
  console.log("
[Step 3] 驗證黑板事實同步...");
  const facts = blackboard.getFacts();
  const hasOracleFact = !!facts.last_result_oracle;
  const hasReviewerFact = !!facts.last_result_reviewer;
  testResults.push({ name: "Blackboard Sync", success: hasOracleFact && hasReviewerFact });

  // 總結
  console.log("
📊 整合測試總結:");
  testResults.forEach(r => console.log(`${r.success ? "✅" : "❌"} ${r.name}`));

  const allPassed = testResults.every(r => r.success);
  if (allPassed) {
    console.log("
🏆 所有整合測試通過！Taonix v14.1.0 已準備好發布。");
    process.exit(0);
  } else {
    console.error("
❌ 部分測試失敗，請檢查 Agent 實體邏輯。");
    process.exit(1);
  }
}

runIntegrationTest().catch(e => {
  console.error("崩潰:", e);
  process.exit(1);
});
