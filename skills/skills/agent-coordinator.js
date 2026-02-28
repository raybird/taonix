export const agentCoordinator = {
  name: "agent-coordinator",
  description: "智能代理協調 - 自動分派任務給合適的 Agent",
  keywords: [
    "協調",
    "分派",
    "分配",
    "coordination",
    "delegate",
    "多個 agent",
    "團隊",
  ],

  async execute(context) {
    const { task, agents } = context;

    const taskAnalysis = analyzeTask(task);
    const assignedAgents = assignAgents(taskAnalysis, agents);

    return {
      task: task,
      analysis: taskAnalysis,
      assignedAgents: assignedAgents,
      executionPlan: generateExecutionPlan(assignedAgents),
    };
  },
};

function analyzeTask(task) {
  const taskLower = task.toLowerCase();

  return {
    complexity: estimateComplexity(task),
    domains: extractDomains(task),
    estimatedSteps: estimateSteps(task),
    requiresCollaboration:
      taskLower.includes("協作") || taskLower.includes("多個"),
  };
}

function estimateComplexity(task) {
  const length = task.length;
  if (length < 50) return "simple";
  if (length < 150) return "medium";
  return "complex";
}

function extractDomains(task) {
  const domains = [];
  const taskLower = task.toLowerCase();

  if (
    taskLower.includes("程式") ||
    taskLower.includes("code") ||
    taskLower.includes("開發")
  ) {
    domains.push("coding");
  }
  if (
    taskLower.includes("設計") ||
    taskLower.includes("ui") ||
    taskLower.includes("介面")
  ) {
    domains.push("design");
  }
  if (taskLower.includes("分析") || taskLower.includes("架構")) {
    domains.push("analysis");
  }
  if (taskLower.includes("測試") || taskLower.includes("test")) {
    domains.push("testing");
  }
  if (
    taskLower.includes("產品") ||
    taskLower.includes("規劃") ||
    taskLower.includes("prd")
  ) {
    domains.push("product");
  }

  return domains.length > 0 ? domains : ["general"];
}

function estimateSteps(task) {
  const sentences = task.split(/[。！？\n]/).filter((s) => s.trim().length > 0);
  return Math.max(1, Math.ceil(sentences.length / 2));
}

function assignAgents(taskAnalysis, availableAgents) {
  const agentMapping = {
    coding: ["小碼", "把關"],
    design: ["小設"],
    analysis: ["小析", "小探"],
    testing: ["小測"],
    product: ["小策"],
    general: ["小探", "小碼"],
  };

  const assigned = [];

  for (const domain of taskAnalysis.domains) {
    const domainAgents = agentMapping[domain] || agentMapping.general;
    for (const agent of domainAgents) {
      if (!assigned.includes(agent)) {
        assigned.push(agent);
      }
    }
  }

  if (taskAnalysis.requiresCollaboration && assigned.length < 2) {
    assigned.push("小析");
  }

  return assigned;
}

function generateExecutionPlan(agents) {
  if (agents.length === 1) {
    return [
      {
        order: 1,
        agent: agents[0],
        strategy: "direct",
      },
    ];
  }

  return agents.map((agent, index) => ({
    order: index + 1,
    agent: agent,
    strategy: "collaborative",
    dependsOn: index > 0 ? [agents[index - 1]] : [],
  }));
}

export default agentCoordinator;
