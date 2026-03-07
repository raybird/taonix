import { createTaskSpec, isTaskSpec, normalizeTaskInput } from "../contracts/task-spec.js";

function extractPath(input) {
  const match = input.match(/(\.{0,2}\/[^\s]+|\/[^\s]+|[A-Za-z0-9_.-]+\.[A-Za-z0-9]+)\b/);
  return match ? match[1] : process.cwd();
}

function scoreCapability(input, capability) {
  const lower = input.toLowerCase();
  return capability.keywords.reduce((score, keyword) => {
    return lower.includes(keyword.toLowerCase()) ? score + 1 : score;
  }, 0);
}

function buildRuleArgs(capabilityName, input) {
  switch (capabilityName) {
    case "web_search":
      return { query: input };
    case "github_trending":
      return {
        language: /python|javascript|typescript|rust|go|java/i.exec(input)?.[0] || "",
      };
    case "analyze_structure":
      return { directory: extractPath(input) };
    case "check_quality":
      return { filepath: extractPath(input) };
    default:
      return {};
  }
}

export class Router {
  constructor(registry, options = {}) {
    this.registry = registry;
    this.enableClassifier = options.enableClassifier || false;
    this.defaultCapability = options.defaultCapability || "analyze_structure";
  }

  async route(input, options = {}) {
    if (isTaskSpec(input)) {
      return {
        taskSpec: createTaskSpec(input),
        route: { method: "task_spec", confidence: 1 },
      };
    }

    const normalized = normalizeTaskInput(input, options);
    const exact = this.registry.getCapability(normalized.input);
    if (exact) {
      return {
        taskSpec: createTaskSpec({
          ...normalized,
          capability: exact.name,
          args: {},
        }),
        route: { method: "exact_capability", confidence: 1 },
      };
    }

    const scored = this.registry
      .listCapabilities()
      .map((capability) => ({
        capability,
        score: scoreCapability(normalized.input, capability),
      }))
      .sort((left, right) => right.score - left.score);

    if (scored[0] && scored[0].score > 0) {
      return {
        taskSpec: createTaskSpec({
          ...normalized,
          capability: scored[0].capability.name,
          args: buildRuleArgs(scored[0].capability.name, normalized.input),
        }),
        route: { method: "rule_based", confidence: Math.min(scored[0].score / 3, 1) },
      };
    }

    if (this.enableClassifier && typeof options.classifier === "function") {
      const classified = await options.classifier(normalized.input, this.registry.listCapabilities());
      if (classified?.capability && this.registry.getCapability(classified.capability)) {
        return {
          taskSpec: createTaskSpec({
            ...normalized,
            capability: classified.capability,
            args: classified.args || {},
          }),
          route: { method: "ai_classifier", confidence: classified.confidence || 0.5 },
        };
      }
    }

    return {
      taskSpec: createTaskSpec({
        ...normalized,
        capability: this.defaultCapability,
        args: buildRuleArgs(this.defaultCapability, normalized.input),
        meta: {
          ...normalized.meta,
          routingFallback: true,
        },
      }),
      route: { method: "deterministic_fallback", confidence: 0 },
    };
  }
}
