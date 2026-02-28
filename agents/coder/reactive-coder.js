import { AgentListener } from "../../ai-engine/lib/agent-listener.js";

/**
 * Reactive Coder Agent (v4.1.0)
 * 專門用於監聽 EventBus 上的任務並自動執行。
 */
async function startCoder() {
  const coder = new AgentListener("coder");

  const handlers = {
    "TASK_ASSIGNED": async (payload) => {
      console.log(`[ReactiveCoder] 正在處理任務: ${payload.task}`);
      
      // 模擬執行時間
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return {
        status: "success",
        output: `已自動完成任務: ${payload.task}`,
        filesChanged: 0,
        timestamp: new Date().toISOString()
      };
    }
  };

  coder.start(handlers);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  startCoder().catch(console.error);
}
