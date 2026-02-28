import { eventBus } from "./event-bus.js";

/**
 * Agent Listener (v4.1.0)
 * 提供 Agent 監聽事件並自動回應的能力。
 */
export class AgentListener {
  constructor(agentName) {
    this.agentName = agentName;
    this.subscriptions = [];
  }

  /**
   * 啟動監聽
   * @param {object} handlers 定義事件處理函式, 如: { "TASK_ASSIGNED": (evt) => ... }
   */
  start(handlers = {}) {
    console.log(`[${this.agentName}] 已啟動事件監聽...`);
    
    // 預設監聽任務指派
    const unsubscribeTask = eventBus.subscribe("TASK_ASSIGNED", (event) => {
      if (event.payload.targetAgent === this.agentName || event.payload.targetAgent === "all") {
        this.handleTask(event, handlers["TASK_ASSIGNED"]);
      }
    });
    this.subscriptions.push(unsubscribeTask);

    // 支援自定義事件監聽
    Object.entries(handlers).forEach(([evtName, handler]) => {
      if (evtName !== "TASK_ASSIGNED") {
        const unsub = eventBus.subscribe(evtName, (event) => handler(event));
        this.subscriptions.push(unsub);
      }
    });
  }

  async handleTask(event, customHandler) {
    console.log(`[${this.agentName}] 收到任務指派: ${event.payload.task}`);
    
    // 1. 發布開始執行事件
    eventBus.publish("TASK_STARTED", { 
      taskId: event.payload.taskId, 
      originalEventId: event.id 
    }, this.agentName);

    // 2. 執行具體邏輯 (若有提供 Handler)
    let result = { status: "processed" };
    if (customHandler) {
      try {
        result = await customHandler(event.payload);
      } catch (err) {
        eventBus.publish("TASK_ERROR", { 
          taskId: event.payload.taskId, 
          error: err.message 
        }, this.agentName);
        return;
      }
    }

    // 3. 發布完成事件
    eventBus.publish("TASK_COMPLETED", { 
      taskId: event.payload.taskId, 
      result 
    }, this.agentName);
  }

  stop() {
    this.subscriptions.forEach(unsub => unsub());
    console.log(`[${this.agentName}] 已停止監聽。`);
  }
}
