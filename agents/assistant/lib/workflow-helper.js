export async function createWorkflow(steps, name = "workflow") {
  const workflow = {
    id: generateId(),
    name,
    steps: steps.map((step, index) => ({
      order: index + 1,
      ...step,
      status: "pending",
    })),
    status: "created",
    createdAt: new Date().toISOString(),
  };

  return workflow;
}

export async function executeWorkflow(workflow) {
  const results = [];

  for (const step of workflow.steps) {
    try {
      const result = {
        step: step.order,
        name: step.name,
        status: "completed",
        output: step.action ? await executeAction(step.action) : null,
        timestamp: new Date().toISOString(),
      };
      results.push(result);
    } catch (error) {
      results.push({
        step: step.order,
        name: step.name,
        status: "failed",
        error: error.message,
        timestamp: new Date().toISOString(),
      });
      break;
    }
  }

  return {
    workflowId: workflow.id,
    results,
    completed: results.filter((r) => r.status === "completed").length,
    failed: results.filter((r) => r.status === "failed").length,
  };
}

async function executeAction(action) {
  if (typeof action === "function") {
    return await action();
  }
  return { executed: true, action: String(action) };
}

export async function listWorkflows() {
  return {
    workflows: [],
    count: 0,
  };
}

function generateId() {
  return `wf_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}
