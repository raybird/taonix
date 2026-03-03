/**
 * IPC 結構化輸出工具
 * 當 Dispatcher 設定 TAONIX_IPC=1 時，透過 sentinel 前綴輸出結構化 JSON 結果。
 */

const SENTINEL = "__TAONIX_RESULT__";

/**
 * 將結構化結果輸出至 stdout（僅在 IPC 模式下）。
 * @param {object} data - 結構化結果物件（如 { success, taskId, data, score }）
 */
export function emitResult(data) {
  if (process.env.TAONIX_IPC !== "1") return;
  process.stdout.write(SENTINEL + JSON.stringify(data) + "\n");
}
