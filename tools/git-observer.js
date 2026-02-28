import { execSync } from "child_process";
import { eventBus } from "../ai-engine/lib/event-bus.js";
import { blackboard } from "../memory/blackboard.js";

/**
 * Taonix Git Observer (v4.3.0)
 * 監控本地倉庫狀態，並在變動時發布事件。
 */
export class GitObserver {
  constructor(repoPath = "/app/workspace/projects/taonix") {
    this.repoPath = repoPath;
    this.lastHash = this.getCurrentHash();
  }

  getCurrentHash() {
    try {
      return execSync(`git -C ${this.repoPath} rev-parse HEAD`).toString().trim();
    } catch (e) {
      return null;
    }
  }

  /**
   * 執行一次檢查
   */
  check() {
    const currentHash = this.getCurrentHash();
    if (!currentHash) return;

    if (currentHash !== this.lastHash) {
      console.log(`[GitObserver] 偵測到新提交: ${currentHash}`);
      
      const details = execSync(`git -C ${this.repoPath} log -1 --pretty=format:"%s|%an"`).toString().trim();
      const [subject, author] = details.split("|");

      // 1. 發布事件
      eventBus.publish("GIT_COMMIT_DETECTED", {
        hash: currentHash,
        prevHash: this.lastHash,
        subject,
        author
      }, "git-observer");

      // 2. 更新黑板
      blackboard.updateFact("latest_git_commit", { hash: currentHash, subject }, "git-observer");
      blackboard.recordThought("git-observer", `偵測到由 ${author} 提交的新代碼：「${subject}」。建議啟動自動化測試。`);

      this.lastHash = currentHash;
      return true;
    }
    return false;
  }

  /**
   * 啟動輪詢監控
   */
  startPolling(interval = 30000) {
    console.log(`[GitObserver] 已啟動輪詢監控: ${this.repoPath}`);
    setInterval(() => this.check(), interval);
  }
}

export const gitObserver = new GitObserver();
