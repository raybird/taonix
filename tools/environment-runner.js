import { exec } from "child_process";
import { promisify } from "util";
import { blackboard } from "../memory/blackboard.js";

const execAsync = promisify(exec);

/**
 * Taonix Environment Runner (v4.3.0)
 * 負責執行真實環境腳本並回報狀態。
 */
export class EnvironmentRunner {
  /**
   * 執行指令並自動記錄推理與事實
   * @param {string} command 指令
   * @param {string} agent 執行 Agent
   * @param {string} context 任務上下文
   */
  async run(command, agent, context) {
    console.log(`[EnvRunner] ${agent} 正在執行指令: ${command}`);
    blackboard.recordThought(agent, `啟動真實執行：執行指令 「${command}」 以完成 ${context}。`);

    try {
      const { stdout, stderr } = await execAsync(command, { timeout: 60000 });
      
      const result = {
        success: true,
        output: stdout.substring(0, 1000),
        timestamp: new Date().toISOString()
      };

      blackboard.recordThought(agent, `指令執行成功。輸出結果已擷取。`);
      blackboard.updateFact(`last_${agent}_run`, result, agent);
      
      return result;
    } catch (error) {
      const result = {
        success: false,
        error: error.message,
        stderr: error.stderr,
        timestamp: new Date().toISOString()
      };

      blackboard.recordThought(agent, `指令執行失敗！錯誤資訊: ${error.message.substring(0, 100)}`);
      blackboard.updateFact(`last_${agent}_run`, result, agent);
      
      throw error;
    }
  }
}

export const envRunner = new EnvironmentRunner();
