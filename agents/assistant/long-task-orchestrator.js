import { AICaller } from "../../ai-engine/lib/ai-caller.js";
import { taskStateMachine } from "../../ai-engine/lib/task-state-machine.js";
import { eventBus } from "../../ai-engine/lib/event-bus.js";
import { blackboard } from "../../memory/blackboard.js";

/**
 * Taonix Long Task Orchestrator (v9.0.0)
 * 負責將複雜目標轉化為長程工作流並驅動執行。
 */
export class LongTaskOrchestrator {
  constructor() {
    this.aiCaller = new AICaller();
    this.init();
  }

  init() {
    console.log("[Orchestrator] 已啟動工作流監聽器...");
    
    // 監聽任務完成事件，實現自動步進
    eventBus.subscribe("TASK_COMPLETED", (event) => {
      const { parentTaskId, stepId, result } = event.payload;
      if (parentTaskId) {
        console.log(`[Orchestrator] 收到步驟完成回報: ${parentTaskId} (Step: ${stepId})`);
        taskStateMachine.advance(parentTaskId, stepId, result);
        this.executeNextStep(parentTaskId);
      }
    });
  }

  /**
   * 啟動長程任務
   * @param {string} goal 複雜目標描述
   */
  async startWorkflow(goal) {
    console.log(`[Orchestrator] 正在為目標規劃長程工作流: ${goal.substring(0, 30)}...`);
    blackboard.recordThought("assistant", `開始規劃長程任務鏈：${goal}`);

    const systemPrompt = `你是一個高級工程編排器。請將使用者的目標分解為 3-5 個邏輯步驟。
請返回 JSON 格式：
{
  "taskId": "task_kebab_case",
  "steps": [
    { "agent": "explorer|coder|tester|oracle", "description": "具體動作描述" }
  ]
}`;

    const response = await this.aiCaller.call(`目標: ${goal}`, { systemPrompt });
    if (response.error) throw new Error(response.error);

    try {
      const plan = JSON.parse(response.content);
      const taskId = `${plan.taskId}_${Date.now()}`;
      
      // 1. 初始化狀態機
      const state = taskStateMachine.createTask(taskId, plan.steps);

      // 2. 啟動第一步
      this.executeNextStep(taskId);

      return { success: true, taskId };
    } catch (e) {
      console.error(`[Orchestrator] 工作流生成失敗:`, e.message);
      throw e;
    }
  }

  /**
   * 執行下一個待辦步驟
   */
  async executeNextStep(taskId) {
    const task = taskStateMachine.getTaskState(taskId);
    if (!task || task.status === "completed") return;

    const currentStep = task.steps[task.currentStep];
    if (currentStep) {
      console.log(`[Orchestrator] 正在啟動步驟 ${task.currentStep}: ${currentStep.description} (Agent: ${currentStep.agent})`);
      
      // 透過 EventBus 廣播任務指派
      eventBus.publish("TASK_ASSIGNED", {
        taskId: `${taskId}_s${task.currentStep}`,
        parentTaskId: taskId,
        stepId: task.currentStep,
        targetAgent: currentStep.agent,
        task: currentStep.description
      }, "orchestrator");
    }
  }
}

export const longTaskOrchestrator = new LongTaskOrchestrator();
