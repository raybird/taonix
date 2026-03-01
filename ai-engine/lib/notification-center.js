import { eventBus } from "./event-bus.js";
import { blackboard } from "../../memory/blackboard.js";

/**
 * Taonix Notification Center (v11.0.0)
 * 負責將系統關鍵事件推送至外部通訊平台。
 */
export class NotificationCenter {
  constructor() {
    this.webhookUrl = process.env.TAONIX_WEBHOOK_URL || null;
    this.init();
  }

  init() {
    console.log("[Notification] 通知中心已啟動，正在監聽關鍵事件...");

    // 1. 監聽任務完成
    eventBus.subscribe("LONG_TASK_FINISHED", (event) => {
      this.notify(`✅ 任務完成: ${event.payload.taskId}`);
    });

    // 2. 監聽環境異常 (自癒警告)
    eventBus.subscribe("BLACKBOARD_UPDATED", (event) => {
      const facts = blackboard.getFacts();
      if (facts.config_mismatch) {
        this.notify(`⚠️ 環境警告: 偵測到配置不一致，建議檢查系統狀態。`, "warning");
      }
    });
  }

  /**
   * 推送訊息
   */
  async notify(message, level = "info") {
    if (!this.webhookUrl) {
      console.log(`[Notification] (模擬推送) [${level.toUpperCase()}] ${message}`);
      return;
    }

    try {
      await fetch(this.webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: `[Taonix v11.0] ${message}` })
      });
      console.log(`[Notification] 已成功發送外部通知。`);
    } catch (e) {
      console.warn(`[Notification] 通報失敗: ${e.message}`);
    }
  }
}

export const notificationCenter = new NotificationCenter();
