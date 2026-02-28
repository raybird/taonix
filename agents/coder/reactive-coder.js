import { AgentListener } from "../../ai-engine/lib/agent-listener.js";
import { blackboard } from "../../memory/blackboard.js";

/**
 * Reactive Coder Agent (v4.2.0)
 * 具備黑板感知能力的反應式 Coder。
 */
async function startCoder() {
  const coder = new AgentListener("coder");

  const handlers = {
    "TASK_ASSIGNED": async (payload) => {
      console.log(`[ReactiveCoder] 收到新任務: ${payload.task}`);
      
      // 1. 讀取目前的黑板資訊
      const context = blackboard.getSummaryForContext();
      console.log(`[ReactiveCoder] 獲取黑板上下文成功。`);

      // 2. 記錄執行前分析 (Thought)
      blackboard.recordThought("coder", `準備執行任務: 「${payload.task}」。分析上下文後，我將採用非侵入式修改方案。`);

      // 3. 模擬執行與環境檢查
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const success = Math.random() > 0.1; // 模擬 90% 成功率
      
      if (success) {
        // 4. 記錄發現與更新事實
        blackboard.recordThought("coder", `任務執行成功。我發現目標檔案結構符合預期，無需額外依賴。`);
        blackboard.updateFact("last_coder_execution", { status: "success", task: payload.task }, "coder");
        
        return {
          status: "success",
          output: `已根據全域上下文完成任務: ${payload.task}`,
          filesChanged: 1
        };
      } else {
        blackboard.recordThought("coder", `執行過程中遇到權限問題，推測是容器唯讀限制。`);
        throw new Error("唯讀檔案系統錯誤");
      }
    }
  };

  coder.start(handlers);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  startCoder().catch(console.error);
}
