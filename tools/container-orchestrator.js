import { envRunner } from "./environment-runner.js";
import { blackboard } from "../memory/blackboard.js";
import { eventBus } from "../ai-engine/lib/event-bus.js";
import fs from "fs";

/**
 * Taonix Container Orchestrator (v11.1.0 - Adaptive Edition)
 * 具備環境感知能力的調度器，支援原生 Docker 與 代理監控模式。
 */
export class ContainerOrchestrator {
  constructor() {
    this.probeDir = "/app/workspace/.data/cluster_probes";
    if (!fs.existsSync(this.probeDir)) fs.mkdirSync(this.probeDir, { recursive: true });
  }

  async discoverContainers() {
    console.log("[Orchestrator] 啟動跨域服務發現 (環境自適應模式)...");
    
    // 優先嘗試原生 Docker
    try {
      const dockerCheck = await envRunner.run("docker --version", "container-orch", "環境檢查");
      if (dockerCheck.success) {
        return await this.nativeDockerDiscover();
      }
    } catch (e) {
      console.log("[Orchestrator] 原生 Docker 環境不可用，切換至「代理探針」模式。");
    }

    return await this.proxyProbeDiscover();
  }

  /**
   * 代理探針模式：透過共享目錄掃描其他容器的「脈動檔案」
   */
  async proxyProbeDiscover() {
    blackboard.recordThought("container-orch", "正在透過 .data/cluster_probes 掃描協作容器...");
    
    try {
      const files = fs.readdirSync(this.probeDir);
      const containers = files.map(f => {
        const data = JSON.parse(fs.readFileSync(`${this.probeDir}/${f}`, "utf-8"));
        return { name: f.replace(".json", ""), status: data.status, lastSeen: data.timestamp };
      });

      blackboard.updateFact("discovered_containers", containers, "container-orch");
      return containers;
    } catch (e) {
      console.error("[Orchestrator] 代理掃描失敗:", e.message);
      return [];
    }
  }

  async nativeDockerDiscover() {
    // 之前的 docker ps 邏輯
    const result = await envRunner.run("docker ps --format '{{.Names}}|{{.Status}}'", "container-orch", "外部容器掃描");
    // ... 解析邏輯
    return [];
  }
}

export const containerOrchestrator = new ContainerOrchestrator();
