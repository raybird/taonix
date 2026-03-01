import vm from "vm";
import { paths } from "../config/paths.js";
import fs from "fs";

/**
 * Skill Sandbox (v13.1.0 - Enhanced)
 * 解決 Risk D: 實作真正的網路阻斷與細粒度 FS 注入。
 */
export class SkillSandbox {
  constructor(policy = {}) {
    this.policy = {
      allowFS: false,
      allowNetwork: false,
      ...policy
    };
    this.logPath = paths.data + "/sandbox_audit.jsonl";
  }

  async run(code, context = {}) {
    const auditRecord = {
      timestamp: new Date().toISOString(),
      skillName: context.skillName || "unknown",
      policy: this.policy,
      status: "started"
    };

    // 1. 建立受限的環境沙盒
    const sandbox = {
      console: console,
      setTimeout: setTimeout,
      Buffer: Buffer,
      // 依策略注入 FS
      fs: this.policy.allowFS ? this.createRestrictedFS() : null,
      // 依策略注入 Network (Risk D Fix)
      fetch: this.policy.allowNetwork ? fetch : this.createBlockedFetch(),
      ...context.data
    };

    try {
      const script = new vm.Script(code);
      vm.createContext(sandbox);
      const result = await script.runInContext(sandbox, { timeout: 5000 });
      
      this.logAudit({ ...auditRecord, status: "success" });
      return result;
    } catch (e) {
      this.logAudit({ ...auditRecord, status: "failed", error: e.message });
      throw e;
    }
  }

  createBlockedFetch() {
    return () => {
      throw new Error("[Sandbox] 網路存取遭拒：目前的 Policy 不允許外部網路請求。");
    };
  }

  createRestrictedFS() {
    // 僅允許讀取 temp 目錄
    return {
      readFileSync: (p) => {
        if (!p.includes("temp")) throw new Error("FS 存取受限");
        return fs.readFileSync(p);
      }
    };
  }

  logAudit(record) {
    fs.appendFileSync(this.logPath, JSON.stringify(record) + "\n");
  }
}
