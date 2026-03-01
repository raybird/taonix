import { spawn } from "child_process";
import path from "path";
import { eventBus } from "./event-bus.js";
import { blackboard } from "../../memory/blackboard.js";

/**
 * Agent Dispatcher (v14.0.0 - Hardened Edition)
 * 解決 Risk C 並落實「穩定扎實」：加入重試、超時與生命週期管理。
 */
export class AgentDispatcher {
  constructor() {
    this.agentsDir = path.join(process.cwd(), "agents");
    this.maxRetries = 3;
    this.timeoutMs = 30000; // 30秒強制超時
  }

  async dispatch(intent, retryCount = 0) {
    const { agent, task, params } = intent;
    const taskId = `exec_${Date.now()}_r${retryCount}`;

    console.log(`[Dispatcher] 分發任務 ${taskId} (嘗試 ${retryCount + 1}/${this.maxRetries})...`);
    eventBus.publish("TASK_STARTED", { taskId, agent, task, timestamp: Date.now() }, "dispatcher");

    try {
      const result = await this.executeWithTimeout(agent, task, params);
      
      if (result.success) {
        this.reportCompletion(taskId, agent, result.output);
        return result;
      } else {
        throw new Error(result.error || "未知執行錯誤");
      }
    } catch (e) {
      console.warn(`[Dispatcher] 任務失敗: ${e.message}`);
      
      if (retryCount < this.maxRetries - 1) {
        console.log(`[Dispatcher] 1秒後進行重試...`);
        await new Promise(r => setTimeout(r, 1000));
        return this.dispatch(intent, retryCount + 1);
      }

      this.reportFailure(taskId, agent, e.message);
      return { success: false, error: e.message };
    }
  }

  async executeWithTimeout(agent, task, params) {
    const agentScript = path.join(this.agentsDir, agent, "index.js");
    
    return new Promise((resolve) => {
      const child = spawn("node", [agentScript, task, JSON.stringify(params || {})], { stdio: "pipe" });
      
      let output = "";
      const timer = setTimeout(() => {
        child.kill();
        resolve({ success: false, error: "Task execution timeout (30s)" });
      }, this.timeoutMs);

      child.stdout.on("data", (d) => output += d.toString());
      child.stderr.on("data", (d) => output += d.toString());

      child.on("close", (code) => {
        clearTimeout(timer);
        resolve({ success: code === 0, output, code });
      });
    });
  }

  reportCompletion(taskId, agent, output) {
    blackboard.updateFact(`last_success_${agent}`, { taskId, timestamp: Date.now() }, "dispatcher");
    eventBus.publish("TASK_FINISHED", { taskId, agent, status: "success", summary: output.substring(0, 200) }, "dispatcher");
  }

  reportFailure(taskId, agent, error) {
    eventBus.publish("TASK_FAILED", { taskId, agent, status: "failed", error }, "dispatcher");
    blackboard.recordThought("dispatcher", `警告：任務 ${taskId} 在重試次數耗盡後依然失敗。原因: ${error}`);
  }
}

export const agentDispatcher = new AgentDispatcher();
