import { EventEmitter } from "events";
import { paths } from "../../config/paths.js";
import { validateEvent } from "./event-schema.js";
import fs from "fs";

/**
 * EventBus (v14.1.0 - Hardened)
 * 負責系統內部的非同步事件傳遞，並強制執行 Schema 校驗。
 */
class EventBus {
  constructor() {
    this.emitter = new EventEmitter();
    this.logPath = paths.eventLogs;
  }

  publish(name, payload, source = "system", id = null) {
    // v14.1.0 新增：落實紮實實作，拒絕非法 Payload
    try {
      validateEvent(name, payload);
    } catch (e) {
      console.error(`[EventBus] 事件 ${name} 發布遭拒: ${e.message}`);
      return;
    }

    const event = {
      id: id || `evt_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      name,
      payload,
      source,
      timestamp: Date.now(),
    };

    // 1. 本地分發
    this.emitter.emit(name, event);
    this.emitter.emit("*", event);

    // 2. 持久化紀錄
    this.logEvent(event);
  }

  subscribe(name, callback) {
    this.emitter.on(name, callback);
  }

  subscribeAll(callback) {
    this.emitter.on("*", callback);
  }

  logEvent(event) {
    try {
      fs.appendFileSync(this.logPath, JSON.stringify(event) + "\n");
    } catch (e) {
      console.error("[EventBus] 無法寫入日誌:", e.message);
    }
  }
}

export const eventBus = new EventBus();
