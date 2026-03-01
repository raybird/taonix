import path from "path";
import fs from "fs";

/**
 * Taonix 路徑管理器 (v14.0.0 - Hardened)
 * 統一管理所有數據與模組路徑，消除硬編碼 Risk A。
 */
const BASE_DIR = process.env.TAONIX_DATA_DIR || path.join(process.cwd());
const DATA_DIR = path.join(BASE_DIR, ".data");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export const paths = {
  root: BASE_DIR,
  data: DATA_DIR,
  blackboard: path.join(DATA_DIR, "blackboard_state.json"),
  eventLogs: path.join(DATA_DIR, "event_logs.jsonl"),
  goals: path.join(DATA_DIR, "goals.json"),
  productivity: path.join(DATA_DIR, "productivity_stats.json"),
  experience: path.join(DATA_DIR, "experience_base.json"),
  tasks: path.join(DATA_DIR, "task_states.json"),
  registry: path.join(DATA_DIR, "agent_registry.json"),
  audit: path.join(DATA_DIR, "sandbox_audit.jsonl"),
  evolution: path.join(DATA_DIR, "evolution_history.json"),
  skills: path.join(BASE_DIR, "skills", "agentskills"),
  controlSignals: path.join(DATA_DIR, "control_signals"),
  clusterProbes: path.join(DATA_DIR, "cluster_probes")
};
