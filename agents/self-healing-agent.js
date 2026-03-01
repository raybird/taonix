import { AgentListener } from "../ai-engine/lib/agent-listener.js";
import { blackboard } from "../memory/blackboard.js";
import { envRunner } from "../tools/environment-runner.js";
import { clusterController } from "../tools/container-control.js";
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
    console.log("[SelfHealer] 啟動偵測流程...");
    blackboard.recordThought("self-healer", "執行叢集健康度與配置對比...");

    try {
      await this.checkConfigConsistency();
      await this.healExternalCluster();

      if (fs.existsSync(this.errorLog)) {
        const report = fs.readFileSync(this.errorLog, "utf-8");
        if (report.includes("僵屍進程")) {
          await envRunner.run("ps -ef | grep defunct", "self-healer", "進程檢查");
        }
      }
      return { status: "success" };
    } catch (e) {
      console.error("[SelfHealer] 偵測錯誤:", e.message);
      throw e;
    }
  }

  async healExternalCluster() {
    const discovered = blackboard.getFacts().discovered_containers;
    if (discovered && Array.isArray(discovered.value)) {
      for (const container of discovered.value) {
        if (container.status && container.status.includes("Exited")) {
          blackboard.recordThought("self-healer", `[ClusterHeal] 偵測到容器 ${container.name} 處於停止狀態，發送重啟信號。`);
          await clusterController.restartContainer(container.name);
        }
      }
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
        blackboard.recordThought("self-healer", "配置不一致警告：主程序尚未更新配置。建議重啟。");
      }
    }
  }
}

if (import.meta.url === "file://" + process.argv[1]) {
  const healer = new SelfHealingAgent();
  healer.start().catch(console.error);
}
