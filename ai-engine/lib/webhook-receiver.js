import http from "http";
import { eventBus } from "./event-bus.js";
import { blackboard } from "../../memory/blackboard.js";

/**
 * Taonix Webhook Receiver (v7.0.0)
 * 負責接收外部傳入的 Webhook 請求並轉發為系統事件。
 */
export class WebhookReceiver {
  constructor(port = 3001) {
    this.port = port;
    this.server = null;
  }

  /**
   * 啟動接收伺服器
   */
  start() {
    this.server = http.createServer((req, res) => {
      if (req.method === "POST") {
        let body = "";
        req.on("data", chunk => body += chunk);
        req.on("end", () => {
          try {
            const data = JSON.parse(body);
            const source = req.headers["x-taonix-source"] || "external_webhook";
            const eventName = req.headers["x-taonix-event"] || "WEBHOOK_RECEIVED";

            console.log(`[Webhook] 收到來自 ${source} 的事件: ${eventName}`);
            
            // 1. 發布到事件總線
            eventBus.publish(eventName, data, source);

            // 2. 紀錄到黑板
            blackboard.recordThought("webhook", `接收到外部信號 [${eventName}]，數據量: ${body.length} bytes。`);

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ status: "success", eventId: eventName }));
          } catch (e) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ status: "error", message: "Invalid JSON" }));
          }
        });
      } else {
        res.writeHead(405);
        res.end();
      }
    });

    this.server.listen(this.port, () => {
      console.log(`🌐 Webhook Receiver 運行於端口: ${this.port}`);
    });
  }

  stop() {
    if (this.server) this.server.close();
  }
}

export const webhookReceiver = new WebhookReceiver();
