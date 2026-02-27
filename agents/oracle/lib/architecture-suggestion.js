import { analyzeStructure } from "./structure-analyzer.js";
import { analyzeDependencies } from "./dependency-analyzer.js";

export async function suggestArchitecture(directory) {
  const structure = await analyzeStructure(directory);
  const deps = await analyzeDependencies(directory);

  const suggestions = [];

  if (structure.fileCount > 50) {
    suggestions.push({
      type: "structure",
      priority: "high",
      message: "專案檔案數量較多，建議採用模組化結構",
    });
  }

  if (deps.totalDependencies > 30) {
    suggestions.push({
      type: "dependencies",
      priority: "medium",
      message: "依賴數量較多，建議定期清理未使用的依賴",
    });
  }

  if (structure.tree.src || structure.tree.lib) {
    suggestions.push({
      type: "structure",
      priority: "low",
      message: "已有 src/lib 目錄，建議維持清晰的目錄結構",
    });
  }

  return {
    directory,
    fileCount: structure.fileCount,
    dependencyCount: deps.totalDependencies,
    suggestions,
    summary: suggestions.length > 0 ? "發現改進空間" : "結構良好",
  };
}
