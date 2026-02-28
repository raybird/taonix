export class AgentCollaboration {
  constructor() {
    this.roles = {
      orchestrator: ["明鏡", "滄溟"],
      executor: ["鑄焰", "試煉"],
      reviewer: ["守闕"],
      designer: ["天工"],
      planner: ["鴻圖"],
    };
    this.workflows = new Map();
  }

  determineRoles(task) {
    const taskLower = task.toLowerCase();
    const roles = [];

    if (taskLower.includes("分析") || taskLower.includes("架構")) {
      roles.push("orchestrator");
    }
    if (
      taskLower.includes("開發") ||
      taskLower.includes("寫") ||
      taskLower.includes("code")
    ) {
      roles.push("executor");
    }
    if (
      taskLower.includes("審查") ||
      taskLower.includes("檢查") ||
      taskLower.includes("review")
    ) {
      roles.push("reviewer");
    }
    if (
      taskLower.includes("設計") ||
      taskLower.includes("ui") ||
      taskLower.includes("介面")
    ) {
      roles.push("designer");
    }
    if (
      taskLower.includes("規劃") ||
      taskLower.includes("prd") ||
      taskLower.includes("需求")
    ) {
      roles.push("planner");
    }

    return roles.length > 0 ? roles : ["orchestrator", "executor"];
  }

  getAgentsForRole(role) {
    return this.roles[role] || [];
  }

  createWorkflow(task, strategy = "sequential") {
    const workflowId = `workflow_${Date.now()}`;
    const roles = this.determineRoles(task);

    const workflow = {
      id: workflowId,
      task,
      strategy,
      roles,
      steps: roles.map((role, index) => ({
        step: index + 1,
        role,
        agents: this.getAgentsForRole(role),
        status: "pending",
      })),
      createdAt: new Date().toISOString(),
    };

    this.workflows.set(workflowId, workflow);
    return workflow;
  }

  async executeWorkflow(workflowId, context = {}) {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) return null;

    const results = [];

    for (const step of workflow.steps) {
      step.status = "running";
      step.startTime = new Date().toISOString();

      const stepResult = await this.executeStep(step, context, results);

      step.status = "completed";
      step.endTime = new Date().toISOString();
      step.result = stepResult;

      results.push({
        step: step.step,
        role: step.role,
        result: stepResult,
      });

      if (stepResult.failed && workflow.strategy === "sequential") {
        workflow.status = "failed";
        break;
      }
    }

    workflow.status = workflow.status || "completed";
    workflow.results = results;

    return results;
  }

  async executeStep(step, context, previousResults) {
    return {
      step: step.step,
      role: step.role,
      agents: step.agents,
      context: { ...context, previousResults },
      executedAt: new Date().toISOString(),
    };
  }

  getWorkflowStatus(workflowId) {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) return null;

    return {
      id: workflow.id,
      task: workflow.task,
      strategy: workflow.strategy,
      status: workflow.status,
      steps: workflow.steps.map((s) => ({
        step: s.step,
        role: s.role,
        status: s.status,
      })),
      createdAt: workflow.createdAt,
    };
  }

  listWorkflows() {
    return Array.from(this.workflows.values()).map((w) => ({
      id: w.id,
      task: w.task.substring(0, 50),
      strategy: w.strategy,
      status: w.status,
      createdAt: w.createdAt,
    }));
  }
}

export function determineCollaboration(task) {
  const collab = new AgentCollaboration();
  return collab.determineRoles(task);
}
