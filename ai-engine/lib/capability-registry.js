const builtInCapabilities = {
  github_trending: {
    agent: "explorer",
    executionMode: "builtin",
    aliases: ["trending", "github-trending"],
  },
  web_search: {
    agent: "explorer",
    executionMode: "builtin",
    aliases: ["search", "web-search"],
  },
  analyze_structure: {
    agent: "oracle",
    executionMode: "builtin",
    aliases: ["structure"],
  },
  analyze_deps: {
    agent: "oracle",
    executionMode: "builtin",
    aliases: ["dependencies"],
  },
  suggest_architecture: {
    agent: "oracle",
    executionMode: "builtin",
    aliases: ["suggest"],
  },
  check_quality: {
    agent: "reviewer",
    executionMode: "builtin",
    aliases: ["quality"],
  },
  check_format: {
    agent: "reviewer",
    executionMode: "builtin",
    aliases: ["format"],
  },
  check_logic: {
    agent: "reviewer",
    executionMode: "builtin",
    aliases: ["logic"],
  },
  read_file: {
    agent: "coder",
    executionMode: "builtin",
    aliases: ["read"],
  },
  write_file: {
    agent: "coder",
    executionMode: "builtin",
    aliases: ["write"],
  },
  list_files: {
    agent: "coder",
    executionMode: "builtin",
    aliases: ["list"],
  },
  run_command: {
    agent: "coder",
    executionMode: "builtin",
    aliases: ["run"],
  },
};

export function getCapability(capability) {
  if (!capability) return null;
  if (builtInCapabilities[capability]) return builtInCapabilities[capability];

  for (const [name, meta] of Object.entries(builtInCapabilities)) {
    if (meta.aliases?.includes(capability)) {
      return { ...meta, name };
    }
  }

  return null;
}

export function isBuiltInCapability(capability) {
  return !!getCapability(capability);
}

export function listCapabilities() {
  return Object.entries(builtInCapabilities).map(([name, meta]) => ({
    name,
    ...meta,
  }));
}
