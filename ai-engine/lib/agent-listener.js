import { eventBus } from "./event-bus.js";
import { consensusEngine } from "../../agents/consensus-engine.js";
import { blackboard } from "../../memory/blackboard.js";

/**
 * Agent Listener (v4.1.0+)
 * 提供 Agent 監聽事件並自動回應的能力。
 * v5.0.0 新增: 自動參與小隊共識投票邏輯。
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
    
    // 1. 監聽任務指派
    const unsubscribeTask = eventBus.subscribe("TASK_ASSIGNED", (event) => {
      if (event.payload.targetAgent === this.agentName || event.payload.targetAgent === "all") {
        this.handleTask(event, handlers["TASK_ASSIGNED"]);
      }
    });
    this.subscriptions.push(unsubscribeTask);

    // 2. 監聽任務提案 (v5.0.0)
    const unsubscribeProposal = eventBus.subscribe("PLAN_PROPOSED", (event) => {
      this.handleProposal(event);
    });
    this.subscriptions.push(unsubscribeProposal);

    // 3. 支援自定義事件監聽
    Object.entries(handlers).forEach(([evtName, handler]) => {
      if (evtName !== "TASK_ASSIGNED" && evtName !== "PLAN_PROPOSED") {
        const unsub = eventBus.subscribe(evtName, (event) => handler(event));
        this.subscriptions.push(unsub);
      }
    });
  }

  /**
   * 自動參與共識投票
   */
  async handleProposal(event) {
    const { proposalId, squadId, plan } = event.payload;
    
    // 檢查自己是否在該小隊中
    const squadFact = blackboard.getFacts()[`active_squad_${plan.taskId}`];
    if (squadFact && squadFact.value.members.includes(this.agentName)) {
      console.log(`[${this.agentName}] 偵測到所屬小隊提案 ${proposalId}，準備投下同意票...`);
      // 模擬分析時間
      await new Promise(resolve => setTimeout(resolve, 500));
      consensusEngine.castVote(proposalId, this.agentName, "approve", "Looks good to me.");
    }
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
