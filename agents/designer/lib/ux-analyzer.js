import fs from "fs";
import path from "path";

export async function analyzeUX(directory) {
  const analysis = {
    navigation: { score: 0, issues: [], suggestions: [] },
    interaction: { score: 0, issues: [], suggestions: [] },
    accessibility: { score: 0, issues: [], suggestions: [] },
    performance: { score: 0, issues: [], suggestions: [] },
  };

  try {
    const files = getAllFiles(directory, [".html", ".jsx", ".tsx", ".vue"]);

    for (const file of files) {
      const content = fs.readFileSync(file, "utf-8");
      analyzeFile(content, analysis);
    }

    const totalScore = Math.round(
      (analysis.navigation.score +
        analysis.interaction.score +
        analysis.accessibility.score +
        analysis.performance.score) /
        4,
    );

    return { ...analysis, totalScore, filesAnalyzed: files.length };
  } catch (error) {
    return { error: error.message };
  }
}

function getAllFiles(dir, extensions) {
  const files = [];

  if (!fs.existsSync(dir)) return files;

  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (
      item.isDirectory() &&
      !item.name.startsWith(".") &&
      item.name !== "node_modules"
    ) {
      files.push(...getAllFiles(fullPath, extensions));
    } else if (
      item.isFile() &&
      extensions.some((ext) => item.name.endsWith(ext))
    ) {
      files.push(fullPath);
    }
  }

  return files;
}

function analyzeFile(content, analysis) {
  if (
    content.includes("<nav") ||
    content.includes("navigation") ||
    content.includes("router")
  ) {
    analysis.navigation.score += 20;
  } else {
    analysis.navigation.issues.push("未發現導航元件");
  }

  if (
    content.includes("onClick") ||
    content.includes("@click") ||
    content.includes("addEventListener")
  ) {
    analysis.interaction.score += 20;
  }

  if (
    content.includes("aria-") ||
    content.includes("role=") ||
    content.includes("tabindex")
  ) {
    analysis.accessibility.score += 20;
  } else {
    analysis.accessibility.issues.push("缺少無障礙屬性");
    analysis.accessibility.suggestions.push("添加 aria-* 屬性");
  }

  if (
    content.includes("lazy") ||
    content.includes("Suspense") ||
    content.includes("defer")
  ) {
    analysis.performance.score += 20;
  }

  analysis.navigation.suggestions.push("確保導航清晰一致");
  analysis.interaction.suggestions.push("提供視覺回饋");
  analysis.performance.suggestions.push("考慮lazy loading");
}
