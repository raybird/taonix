const agentCapabilities = {
  explorer: {
    name: "小探",
    tools: ["github_trending", "web_search"],
    description: "搜尋、爬蟲專家",
  },
  coder: {
    name: "小碼",
    tools: [
      "read_file",
      "write_file",
      "list_files",
      "run_command",
      "code_review",
    ],
    description: "程式開發專家",
  },
  oracle: {
    name: "小析",
    tools: ["analyze_structure", "analyze_deps", "suggest_architecture"],
    description: "架構分析專家",
  },
  reviewer: {
    name: "把關",
    tools: ["check_quality", "check_format", "check_logic"],
    description: "品質把關專家",
  },
};

export async function dispatchAgent(intent) {
  const { agent: primaryAgent, intent: intentType } = intent;

  const selectedAgents = [];

  if (primaryAgent && primaryAgent !== "unknown") {
    selectedAgents.push({
      agent: primaryAgent,
      ...agentCapabilities[primaryAgent],
      matchedIntent: intentType,
    });
  } else {
    for (const [agentName, capabilities] of Object.entries(agentCapabilities)) {
      selectedAgents.push({
        agent: agentName,
        ...capabilities,
        matchedIntent: null,
      });
    }
  }

  return {
    primary: selectedAgents[0] || null,
    all: selectedAgents,
    count: selectedAgents.length,
  };
}

export function listAgents() {
  return Object.entries(agentCapabilities).map(([key, val]) => ({
    id: key,
    ...val,
  }));
}
