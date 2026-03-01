import { envRunner } from "./environment-runner.js";
import { eventBus } from "../ai-engine/lib/event-bus.js";
import { blackboard } from "../memory/blackboard.js";

/**
 * Taonix Container Orchestrator (v11.0.0)
 * 負責跨越 Docker 邊界，感知並管理宿主機上的其他容器服務。
 */
export class ContainerOrchestrator {
  /**
   * 獲取外部容器列表
   */
  async discoverContainers() {
    console.log("[Orchestrator] 啟動跨容器服務發現...");
    blackboard.recordThought("container-orch", "嘗試執行 Docker ps 以感知外部環境...");

    try {
      // 假設環境具備調用 docker 指令的權限 (透過 socket 掛載或 ssh)
      const result = await envRunner.run("docker ps --format '{{.Names}}|{{.Status}}'", "container-orch", "外部容器掃描");
      
      const containers = result.output.trim().split("
").filter(l => l).map(line => {
        const [name, status] = line.split("|");
        return { name, status };
      });

      // 1. 更新黑板
      blackboard.updateFact("discovered_containers", containers, "container-orch");
      blackboard.recordThought("container-orch", `發現 ${containers.length} 個運行中的外部服務。`);

      // 2. 發布事件
      eventBus.publish("EXTERNAL_SERVICES_DISCOVERED", { containers }, "container-orch");

      return containers;
    } catch (e) {
      console.warn("[Orchestrator] 容器發現失敗:", e.message);
      blackboard.recordThought("container-orch", `外部感測受限：無法調用 Docker API。原因：${e.message}`);
      return [];
    }
  }
}

export const containerOrchestrator = new ContainerOrchestrator();
