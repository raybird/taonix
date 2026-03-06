import { analyzeStructure } from "./lib/structure-analyzer.js";
import { analyzeDependencies } from "./lib/dependency-analyzer.js";
import { suggestArchitecture } from "./lib/architecture-suggestion.js";

export async function executeTask(taskSpec, context = {}) {
  const capability = taskSpec.capability || taskSpec.intent || taskSpec.task;
  const args = taskSpec.args || {};
  const directory = args.directory || ".";

  switch (capability) {
    case "analyze_structure":
    case "structure":
      return await analyzeStructure(directory);
    case "analyze_deps":
    case "dependencies":
      return await analyzeDependencies(directory);
    case "suggest_architecture":
    case "suggest":
      return await suggestArchitecture(directory);
    default:
      throw new Error(`Unsupported oracle capability: ${capability}`);
  }
}
