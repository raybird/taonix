import { blackboard } from "../../memory/blackboard.js";
import { paths } from "../../config/paths.js";
import fs from "fs";

/**
 * Taonix Health Check Instrument (v19.0.0)
 * 負責系統穩定性、物理探針與安全性邊界的例行巡檢。
 */
export class HealthCheck {
  constructor() {
    this.init();
  }

  init() {
    console.log("[Health] 穩定性巡檢儀已就緒，每 15 分鐘執行一次全系統掃描。");
    setInterval(() => this.runCheck(), 900000);
  }

  async runCheck() {
    console.log("[Health] 正在啟動系統例行健檢...");
    const report = {
      timestamp: new Date().toISOString(),
      checks: []
    };

    // 1. 黑板健康檢查
    const facts = blackboard.getFacts();
    const factCount = Object.keys(facts).length;
    report.checks.push({ name: "blackboard", status: factCount > 0 ? "healthy" : "warning", detail: `Facts count: ${factCount}` });

    // 2. 宿主機物理探針活性檢查
    const hostStats = facts.host_physical_stats;
    if (hostStats) {
      const lastUpdate = new Date(hostStats.updated).getTime();
      const delay = (Date.now() - lastUpdate) / 1000;
      report.checks.push({ name: "host_probe", status: delay < 300 ? "healthy" : "critical", detail: `Delay: ${delay.toFixed(1)}s` });
    } else {
      report.checks.push({ name: "host_probe", status: "missing", detail: "尚無主機事實注入" });
    }

    // 3. 沙盒審計日誌檢查
    const auditExists = fs.existsSync(paths.sandboxAudit);
    report.checks.push({ name: "sandbox_audit", status: auditExists ? "healthy" : "warning" });

    blackboard.updateFact("system_health_report", report, "health-check");
    blackboard.recordThought("health-check", `健檢完成。目前狀態：${report.checks.map(c => `${c.name}:${c.status}`).join(", ")}。`);
  }
}

export const healthCheck = new HealthCheck();
