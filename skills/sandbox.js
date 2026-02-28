import vm from "vm";
import fs from "fs";
import path from "path";
import { blackboard } from "../memory/blackboard.js";

export class SkillSandbox {
  constructor() {
    this.logPath = "/app/workspace/projects/taonix/.data/sandbox_audit.jsonl";
  }

  async run(code, context, options = {}) {
    const { 
      skillName = "unknown",
      allowFS = false,
      allowNetwork = false
    } = options;
    console.log("[Sandbox] 正在執行: " + skillName);

    const sandboxContext = {
      console: {
        log: (...args) => console.log("[Sandbox:" + skillName + "]", ...args),
        error: (...args) => console.error("[Sandbox:" + skillName + "]", ...args),
      },
      context,
      blackboard: {
        getFacts: () => blackboard.getFacts(),
        recordThought: (content) => blackboard.recordThought("sandbox:" + skillName, content)
      },
      // 根據 options 動態注入敏感 API 的受限版本
      fs: allowFS ? {
        readFileSync: (p) => fs.readFileSync(p, "utf-8"),
        readdirSync: (p) => fs.readdirSync(p)
      } : undefined,
      setTimeout,
      Promise,
    };

    vm.createContext(sandboxContext);

    try {
      const script = new vm.Script(code);
      const result = await script.runInContext(sandboxContext, { timeout: 5000 });
      this.auditLog(skillName, "success");
      return result;
    } catch (error) {
      this.auditLog(skillName, "error", error.message);
      throw new Error("[Sandbox Security Violation] " + error.message);
    }
  }

  auditLog(skillName, status, detail = "") {
    try {
      const entry = {
        timestamp: new Date().toISOString(),
        skillName,
        status,
        detail
      };
      const dir = path.dirname(this.logPath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.appendFileSync(this.logPath, JSON.stringify(entry) + "\n");
    } catch (e) {
      console.error("[SandboxAudit] 寫入失敗: " + e.message);
    }
  }
}
export const skillSandbox = new SkillSandbox();
