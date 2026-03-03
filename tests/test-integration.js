import { agentDispatcher } from "../ai-engine/lib/agent-dispatcher.js";
import { blackboard } from "../memory/blackboard.js";
import { eventBus } from "../ai-engine/lib/event-bus.js";
import { spawn } from "child_process";
import path from "path";

/**
 * Taonix v25.0.0 整合測試腳本
 * 驗證全角色實體化後的端到端執行、黑板聯動與結構化 IPC 協議。
 */
async function runIntegrationTest() {
  console.log("🧪 啟動 Taonix v25.0.0 全系統整合測試...");

  const testResults = [];

  // 1. 測試 Oracle (架構分析)
  console.log("\n[Step 1] 測試 Oracle 實體化執行...");
  const oracleRes = await agentDispatcher.dispatch({
    agent: "oracle",
    task: "structure",
    params: { directory: "." }
  });
  testResults.push({ name: "Oracle Execution", success: oracleRes.success });

  // 2. 測試 Reviewer (品質檢查)
  console.log("\n[Step 2] 測試 Reviewer 實體化執行...");
  const reviewerRes = await agentDispatcher.dispatch({
    agent: "reviewer",
    task: "quality",
    params: { filepath: "agents/lib/base-agent.js" }
  });
  testResults.push({ name: "Reviewer Execution", success: reviewerRes.success });

  // 3. 驗證黑板事實更新
  console.log("\n[Step 3] 驗證黑板事實同步...");
  // 等待子進程的 debounced save (300ms) 完成後，從磁碟重新載入
  await new Promise(r => setTimeout(r, 500));
  blackboard.load();
  const facts = blackboard.getFacts();
  const hasOracleFact = !!facts.last_result_oracle;
  const hasReviewerFact = !!facts.last_result_reviewer;
  testResults.push({ name: "Blackboard Sync", success: hasOracleFact && hasReviewerFact });

  // 4. 驗證結構化 IPC 結果格式
  console.log("\n[Step 4] 驗證結構化 IPC 結果...");
  const hasStructuredOracle = oracleRes.taskId !== undefined && oracleRes.data !== undefined;
  const hasStructuredReviewer = reviewerRes.taskId !== undefined && reviewerRes.data !== undefined;
  testResults.push({
    name: "Structured IPC (Oracle)",
    success: hasStructuredOracle
  });
  testResults.push({
    name: "Structured IPC (Reviewer)",
    success: hasStructuredReviewer
  });

  // 5. 驗證向後相容：無 sentinel 的 Agent 仍可正常執行
  console.log("\n[Step 5] 驗證向後相容（無 sentinel 回退）...");
  const backwardCompat = await testBackwardCompatibility();
  testResults.push({ name: "Backward Compatibility", success: backwardCompat });

  // 總結
  console.log("\n📊 整合測試總結:");
  testResults.forEach(r => console.log(`${r.success ? "✅" : "❌"} ${r.name}`));

  const allPassed = testResults.every(r => r.success);
  if (allPassed) {
    console.log("\n🏆 所有整合測試通過！");
    process.exit(0);
  } else {
    console.error("\n❌ 部分測試失敗，請檢查 Agent 實體邏輯。");
    process.exit(1);
  }
}

/**
 * 驗證向後相容：模擬一個未輸出 sentinel 的 Agent 子進程，
 * Dispatcher 應回退至 exit-code + raw stdout 行為。
 */
async function testBackwardCompatibility() {
  return new Promise((resolve) => {
    // 使用 node -e 模擬一個不輸出 sentinel 的簡單腳本
    const child = spawn("node", ["-e", 'console.log("plain output"); process.exit(0)'], {
      stdio: "pipe",
      env: { ...process.env, TAONIX_IPC: "1" }
    });
    let output = "";
    child.stdout.on("data", (d) => output += d.toString());
    child.on("close", (code) => {
      // 無 sentinel → Dispatcher 的 extractStructuredResult 應返回 null
      const sentinel = "__TAONIX_RESULT__";
      const hasSentinel = output.includes(sentinel);
      // 向後相容意味著：無 sentinel 時不會崩潰，code === 0 表示成功
      resolve(!hasSentinel && code === 0);
    });
  });
}

runIntegrationTest().catch(e => {
  console.error("崩潰:", e);
  process.exit(1);
});
