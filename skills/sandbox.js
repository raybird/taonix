import vm from "vm";
import { paths } from "../config/paths.js";
import fs from "fs";

/**
 * Skill Sandbox (v19.0.0 - Industrial Grade)
 * 解決 Risk D: 實作嚴格的網路攔截 (localhost/private IP) 與權限熔斷。
 */
export class SkillSandbox {
  constructor(policy = {}) {
    this.policy = {
      allowFS: false,
      allowNetwork: false,
      maxExecutionTime: 5000,
      ...policy
    };
    this.logPath = paths.sandboxAudit;
  }

  async run(code, context = {}) {
    const auditRecord = {
      timestamp: new Date().toISOString(),
      skillName: context.skillName || "unknown",
      policy: this.policy,
      status: "started"
    };

    // 建立受限環境
    const sandbox = {
      console: console,
      setTimeout: setTimeout,
      Buffer: Buffer,
      fs: this.policy.allowFS ? this.createRestrictedFS() : this.createBlockedService("FS"),
      fetch: this.policy.allowNetwork ? this.createRestrictedNetwork() : this.createBlockedService("Network"),
      ...context.data
    };

    try {
      const script = new vm.Script(code);
      vm.createContext(sandbox);
      const result = await script.runInContext(sandbox, { timeout: this.policy.maxExecutionTime });
      
      this.logAudit({ ...auditRecord, status: "success" });
      return result;
    } catch (e) {
      this.logAudit({ ...auditRecord, status: "failed", error: e.message });
      throw e;
    }
  }

  createBlockedService(name) {
    return () => { throw new Error(`[Sandbox] ${name} 存取遭拒：目前的 Policy 已停用此功能。`); };
  }

  /**
   * 實作精細化網路攔截 (v19.0.0)
   */
  createRestrictedNetwork() {
    return async (url, options = {}) => {
      const target = new URL(url);
      const hostname = target.hostname.toLowerCase();

      // 1. 禁止本地迴路與私有網段
      const blacklist = ["localhost", "127.0.0.1", "0.0.0.0", "::1", "192.168.", "10.", "172.16."];
      if (blacklist.some(b => hostname.includes(b))) {
        throw new Error(`[Sandbox] 安全攔截：禁止訪問敏感網段 (${hostname})。`);
      }

      console.log(`[Sandbox] 網路請求通過: ${hostname}`);
      return fetch(url, options);
    };
  }

  createRestrictedFS() {
    return {
      readFileSync: (p) => {
        const fullPath = path.resolve(p);
        if (!fullPath.includes("/temp") && !fullPath.includes("/skills")) {
          throw new Error(`[Sandbox] FS 安全攔截：禁止讀取目錄外檔案 (${p})。`);
        }
        return fs.readFileSync(p);
      }
    };
  }

  logAudit(record) {
    try {
      const dir = path.dirname(this.logPath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.appendFileSync(this.logPath, JSON.stringify(record) + "\n");
    } catch (e) {
      console.warn("[Sandbox Audit] 無法寫入日誌:", e.message);
    }
  }
}
