import { AgentListener } from "../ai-engine/lib/agent-listener.js";
import { blackboard } from "../memory/blackboard.js";
import { envRunner } from "../tools/environment-runner.js";
import fs from "fs";

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
    console.log("[SelfHealer] 啟動診斷流程...");
    blackboard.recordThought("self-healer", "分析系統狀態與配置一致性...");

    try {
      await this.checkConfigConsistency();

      if (fs.existsSync(this.errorLog)) {
        const report = fs.readFileSync(this.errorLog, "utf-8");
        if (report.includes("僵屍進程")) {
          await envRunner.run("ps -ef | grep defunct", "self-healer", "僵屍進程檢查");
        }
      }
      return { status: "success" };
    } catch (e) {
      console.error("[SelfHealer] 錯誤:", e.message);
      throw e;
    }
  }

  async checkConfigConsistency() {
    const configPath = "/app/ai-config.yaml";
    const runtimePath = "/app/workspace/context/runtime-status.md";

    if (fs.existsSync(configPath) && fs.existsSync(runtimePath)) {
      const config = fs.readFileSync(configPath, "utf-8");
      const runtime = fs.readFileSync(runtimePath, "utf-8");

      const cfgProv = config.match(/provider:\s*(\w+)/)?.[1];
      const rtProv = runtime.match(/Active Provider:\s*(\w+)/)?.[1];

      if (cfgProv && rtProv && cfgProv !== rtProv) {
        blackboard.updateFact("config_mismatch", { config: cfgProv, runtime: rtProv }, "self-healer");
        blackboard.recordThought("self-healer", "偵測到配置不一致：Config(" + cfgProv + ") vs Runtime(" + rtProv + ")。建議重啟。");
      }
    }
  }
}

if (import.meta.url === "file://" + process.argv[1]) {
  const healer = new SelfHealingAgent();
  healer.start().catch(console.error);
}
