import { envRunner } from "./environment-runner.js";
import { blackboard } from "../memory/blackboard.js";
import { eventBus } from "../ai-engine/lib/event-bus.js";

/**
 * Taonix SSH Proxy (v12.0.0)
 * 負責透過 SSH 隧道向宿主機或遠端節點發送管理指令。
 */
export class SSHProxy {
  constructor() {
    this.host = process.env.TAONIX_SSH_HOST || "host.docker.internal";
    this.user = process.env.TAONIX_SSH_USER || "root";
  }

  /**
   * 執行遠端 Docker 指令
   * @param {string} dockerCmd 
   */
  async executeDocker(dockerCmd) {
    console.log(`[SSHProxy] 正在發送遠端指令: ${dockerCmd}`);
    blackboard.recordThought("ssh-proxy", `嘗試透過 SSH 向 ${this.host} 發送指令...`);

    const fullCmd = `ssh -o StrictHostKeyChecking=no ${this.user}@${this.host} "${dockerCmd}"`;

    try {
      const result = await envRunner.run(fullCmd, "ssh-proxy", "遠端 Docker 控制");
      
      if (result.success) {
        blackboard.recordThought("ssh-proxy", `遠端指令執行成功：${dockerCmd}`);
        eventBus.publish("REMOTE_COMMAND_EXECUTED", { cmd: dockerCmd, status: "success" }, "ssh-proxy");
      }
      return result;
    } catch (e) {
      console.warn("[SSHProxy] 遠端執行失敗:", e.message);
      blackboard.recordThought("ssh-proxy", `SSH 連線失敗。請確認 SSH Key 已正確掛載至容器。`);
      return { success: false, error: e.message };
    }
  }
}

export const sshProxy = new SSHProxy();
