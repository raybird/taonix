import { AgentListener } from "../ai-engine/lib/agent-listener.js";
import { blackboard } from "../memory/blackboard.js";
import { envRunner } from "../tools/environment-runner.js";
import fs from "fs";

/**
 * Taonix Self-Healing Agent (v10.0.0)
 * 專門負責偵測系統異常並嘗試自主修復。
 */
export class SelfHealingAgent {
  constructor() {
    this.listener = new AgentListener("self-healer");
    this.errorLog = "/app/workspace/context/error-summary.md";
  }

  async start() {
    const handlers = {
      "SYSTEM_HEALTH_CHECK": async (payload) => {
        return await this.diagnoseAndHeal();
      }
    };
    this.listener.start(handlers);
  }

  async diagnoseAndHeal() {
    console.log("[SelfHealer] 啟動系統自癒流程...");
    blackboard.recordThought("self-healer", "開始分析系統異常診斷報告...");

    try {
      // 1. 讀取目前的錯誤摘要
      if (fs.existsSync(this.errorLog)) {
        const report = fs.readFileSync(this.errorLog, "utf-8");
        
        // 2. 針對「僵屍進程」進行清理嘗試 (如果有權限)
        if (report.includes("僵屍進程")) {
          blackboard.recordThought("self-healer", "發現僵屍進程異常，嘗試執行清理指令...");
          // 這裡模擬執行清理邏輯，實際上可能需要 ps/kill 指令
          await envRunner.run("ps -ef | grep defunct", "self-healer", "僵屍進程診斷");
        }

        // 3. 針對「排程失效」進行配置一致性檢查
        if (report.includes("排程失效")) {
          blackboard.updateFact("healing_action", { target: "scheduler", status: "checking_config" }, "self-healer");
        }
      }

      return { status: "success", message: "自癒診斷完成" };
    } catch (e) {
      console.error("[SelfHealer] 修復過程失敗:", e.message);
      throw e;
    }
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const healer = new SelfHealingAgent();
  healer.start().catch(console.error);
}
