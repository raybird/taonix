import { spawn } from "child_process";
import path from "path";
import { eventBus } from "./event-bus.js";
import { blackboard } from "../../memory/blackboard.js";

/**
 * Agent Dispatcher (v13.1.0)
 * 解決 Risk C: 實作從 Intent 到實體執行的最後一哩路。
 */
export class AgentDispatcher {
  constructor() {
    this.agentsDir = path.join(process.cwd(), "agents");
  }

  /**
   * 分發並執行任務
   * @param {Object} intent - 來自 MCP Router 的意圖物件
   */
  async dispatch(intent) {
    const { agent, task, params } = intent;
    const taskId = `exec_${Date.now()}`;

    console.log(`[Dispatcher] 正在分發任務 ${taskId} 給 ${agent}...`);
    
    // 1. 發布任務開始事件 (P1: Event Schema)
    eventBus.publish("TASK_STARTED", { taskId, agent, task }, "dispatcher");

    try {
      // 2. 啟動實體 Agent CLI
      // 假設每個 agent 目錄下都有 index.js
      const agentScript = path.join(this.agentsDir, agent, "index.js");
      const args = [agentScript, task, JSON.stringify(params || {})];

      const child = spawn("node", args, { stdio: "pipe" });
      let output = "";

      child.stdout.on("data", (data) => output += data.toString());
      child.stderr.on("data", (data) => output += data.toString());

      return new Promise((resolve) => {
        child.on("close", (code) => {
          const success = code === 0;
          
          // 3. 更新黑板事實 (Knowledge Loop)
          blackboard.updateFact(`last_result_${agent}`, { taskId, success, summary: output.substring(0, 500) }, "dispatcher");
          blackboard.recordThought("dispatcher", `任務 ${taskId} (${agent}) 執行完畢，退出碼: ${code}`);

          // 4. 發布完成/失敗事件
          eventBus.publish(success ? "TASK_FINISHED" : "TASK_FAILED", { taskId, agent, output }, "dispatcher");
          
          resolve({ success, taskId, output });
        });
      });

    } catch (e) {
      console.error(`[Dispatcher] 執行崩潰: ${e.message}`);
      eventBus.publish("TASK_FAILED", { taskId, agent, error: e.message }, "dispatcher");
      return { success: false, error: e.message };
    }
  }
}

export const agentDispatcher = new AgentDispatcher();
