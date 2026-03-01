import path from "path";
import fs from "fs";

/**
 * Taonix 路徑管理器
 * 解決 Risk A: 硬編碼路徑問題。
 */
const BASE_DIR = process.env.TAONIX_DATA_DIR || path.join(process.cwd());
const DATA_DIR = path.join(BASE_DIR, ".data");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export const paths = {
  data: DATA_DIR,
  blackboard: path.join(DATA_DIR, "blackboard_state.json"),
  eventLogs: path.join(DATA_DIR, "event_logs.jsonl"),
  goals: path.join(DATA_DIR, "goals.json"),
  productivity: path.join(DATA_DIR, "productivity_stats.json")
};
