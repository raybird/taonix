import { spawn } from "child_process";
import path from "path";
import { eventBus } from "./event-bus.js";
import { blackboard } from "../../memory/blackboard.js";
import { getTimeoutByComplexity } from "./complexity-analyzer.js";

const IPC_SENTINEL = "__TAONIX_RESULT__";

/**
 * Agent Dispatcher (v25.0.0 - Structured IPC)
 * 整合團隊成就系統與結構化 IPC 協議，實作基於榮譽事實的動態能力加權。
 */
export class AgentDispatcher {
  constructor() {
    this.agentsDir = path.join(process.cwd(), "agents");
    this.maxRetries = 3;
    this.timeoutMs = 120_000;
  }

  async dispatch(intent, retryCount = 0) {
    const { agent, task, params } = intent;
    const taskId = `exec_${Date.now()}_r${retryCount}`;

    // v22.0.0 新增：計算榮譽加成
    const honorBonus = this.evaluateHonorBonus(agent);
    if (honorBonus > 0) {
      console.log(`[Dispatcher] 🎖️ 偵測到 Agent ${agent} 具備榮譽成就，調度權重加成: +${honorBonus}%`);
    }

    const timeoutMs = intent.complexity
      ? getTimeoutByComplexity(intent.complexity)
      : this.timeoutMs;

    console.log(`[Dispatcher] 分發任務 ${taskId} (嘗試 ${retryCount + 1}/${this.maxRetries}, 超時: ${timeoutMs / 1000}s)...`);
    eventBus.publish("TASK_STARTED", { taskId, agent, task, timestamp: Date.now(), honor_bonus: honorBonus }, "dispatcher");

    try {
      const result = await this.executeWithTimeout(agent, task, params, timeoutMs);
      
      if (result.success) {
        const summary = result.output || JSON.stringify(result.data || "").substring(0, 500);
        this.reportCompletion(taskId, agent, summary);
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

  /**
   * 評估榮譽事實的加成比例 (v22.0.0)
   */
  evaluateHonorBonus(agentName) {
    const facts = blackboard.getFacts();
    const achievements = facts.team_achievements?.value || [];
    let bonus = 0;

    achievements.forEach(a => {
      if (a.name === "質量守護者") bonus += 15;
      if (a.name === "鐵血默契") bonus += 10;
    });

    return Math.min(bonus, 50); // 最高 50% 加成
  }

  async executeWithTimeout(agent, task, params, timeoutMs) {
    const effectiveTimeout = timeoutMs || this.timeoutMs;
    const agentScript = path.join(this.agentsDir, agent, "index.js");
    return new Promise((resolve) => {
      // 將 params 物件的值展開為位置參數（相容 commander CLI）
      const paramArgs = params ? Object.values(params).map(String) : [];
      const child = spawn("node", [agentScript, task, ...paramArgs], {
        stdio: "pipe",
        env: { ...process.env, TAONIX_IPC: "1" }
      });

      // 透過 stdin 傳送結構化輸入
      const inputPayload = { command: task, args: params || {}, metadata: { agent } };
      child.stdin.write(JSON.stringify(inputPayload));
      child.stdin.end();

      let output = "";
      const timer = setTimeout(() => {
        child.kill();
        resolve({ success: false, error: `Task execution timeout (${effectiveTimeout / 1000}s)` });
      }, effectiveTimeout);
      child.stdout.on("data", (d) => output += d.toString());
      child.stderr.on("data", (d) => output += d.toString());
      child.on("close", (code) => {
        clearTimeout(timer);

        // 嘗試從 stdout 擷取 sentinel 結構化結果
        const structured = this.extractStructuredResult(output);
        if (structured) {
          resolve(structured);
        } else {
          // 回退至原始 exit-code 行為
          resolve({ success: code === 0, output, code });
        }
      });
    });
  }

  /**
   * 從 stdout 中擷取 __TAONIX_RESULT__ sentinel 行並解析為結構化物件。
   * @returns {object|null} 解析後的結構化結果，或 null（回退至原行為）
   */
  extractStructuredResult(output) {
    const lines = output.split("\n");
    for (let i = lines.length - 1; i >= 0; i--) {
      const idx = lines[i].indexOf(IPC_SENTINEL);
      if (idx !== -1) {
        try {
          return JSON.parse(lines[i].substring(idx + IPC_SENTINEL.length));
        } catch {
          return null;
        }
      }
    }
    return null;
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
