import { EventEmitter } from "events";
import fs from "fs";
import path from "path";

export class EventBus {
  constructor() {
    this.emitter = new EventEmitter();
    this.logPath = "/app/workspace/projects/taonix/.data/event_logs.jsonl";
    this.ensureLogDir();
  }

  ensureLogDir() {
    const dir = path.dirname(this.logPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  }

  publish(eventName, payload, source) {
    const event = {
      id: "evt_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5),
      timestamp: new Date().toISOString(),
      name: eventName,
      source,
      payload
    };
    console.log("[EventBus] Publish: " + eventName + " from " + source);
    this.emitter.emit(eventName, event);
    this.emitter.emit("*", event);
    try {
      fs.appendFileSync(this.logPath, JSON.stringify(event) + "\n");
    } catch (e) {
      console.error("[EventBus] Log error: " + e.message);
    }
    return event.id;
  }

  subscribe(eventName, callback) {
    this.emitter.on(eventName, callback);
    return () => this.emitter.off(eventName, callback);
  }

  subscribeAll(callback) {
    this.emitter.on("*", callback);
    return () => this.emitter.off("*", callback);
  }
}
export const eventBus = new EventBus();
