import { eventBus } from "./event-bus.js";
import { apiConnector } from "./api-connector.js";
import { blackboard } from "../../memory/blackboard.js";

/**
 * Taonix Notification Center (v7.0.0)
 * 負責將系統內部的重大事件轉發至外部通訊平台。
 */
export class NotificationCenter {
  constructor() {
    this.channels = new Set(["console"]); // 預設開啟控制台通知
    this.init();
  }

  init() {
    console.log("[NotificationCenter] 通知中心已啟動，正在監聽重要事件...");
    
    // 1. 監聽任務完成
    eventBus.subscribe("TASK_COMPLETED", async (event) => {
      const { taskId, agent, result } = event.payload;
      await this.notify(`✅ 任務完成: ${taskId}
執行者: ${agent}
結果: ${result.status}`);
    });

    // 2. 監聽需要介入的決策 (Arbitrator)
    eventBus.subscribe("HUMAN_INTERVENTION_REQUIRED", async (event) => {
      const { issue } = event.payload;
      await this.notify(`⚠️ 需人工介入: ${issue}`, "high");
    });
  }

  /**
   * 發送通知
   * @param {string} message 訊息內容
   * @param {string} priority 優先級 (low|normal|high)
   */
  async notify(message, priority = "normal") {
    const formattedMsg = `[Taonix Notification] ${message}`;
    
    // 輸出到本地控制台
    console.log(`
🔔 ${formattedMsg}
`);

    // 若已配置 Telegram 端點，則嘗試發送
    try {
      if (this.channels.has("telegram")) {
        await apiConnector.request("telegram_bot", { text: formattedMsg });
      }
    } catch (e) {
      console.warn("[NotificationCenter] 外部通知發送失敗:", e.message);
    }

    // 紀錄到黑板
    blackboard.recordThought("notification", `已發送通知: ${message.substring(0, 30)}...`);
  }

  enableChannel(channel) {
    this.channels.add(channel);
    console.log(`[NotificationCenter] 已開啟通知管道: ${channel}`);
  }
}

export const notificationCenter = new NotificationCenter();
