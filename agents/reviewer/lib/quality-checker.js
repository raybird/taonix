import fs from "fs/promises";

export async function checkQuality(filepath) {
  const content = await fs.readFile(filepath, "utf-8");
  const lines = content.split("\n");

  const issues = {
    complexity: [],
    security: [],
    bestPractices: [],
  };

  let functionCount = 0;
  let nestedDepth = 0;
  let maxDepth = 0;

  lines.forEach((line, index) => {
    if (line.match(/function\s+\w+|const\s+\w+\s*=.*=>|def\s+\w+/)) {
      functionCount++;
    }

    if (line.includes("eval(")) {
      issues.security.push({
        line: index + 1,
        message: "使用 eval() 可能導致安全問題",
      });
    }

    if (
      line.includes("password") ||
      line.includes("secret") ||
      line.includes("api_key")
    ) {
      if (!line.includes("const") && !line.includes("let")) {
        issues.security.push({
          line: index + 1,
          message: "可能存在硬編碼的敏感資訊",
        });
      }
    }

    if (line.match(/for\s*\(.*\)|while\s*\(.*\)/)) {
      nestedDepth++;
      maxDepth = Math.max(maxDepth, nestedDepth);
    }
    if (line.includes("}")) nestedDepth = Math.max(0, nestedDepth - 1);
  });

  if (maxDepth > 3) {
    issues.complexity.push({
      message: `巢狀深度過深 (${maxDepth} 層)，建議重構`,
    });
  }

  return {
    filepath,
    totalLines: lines.length,
    functionCount,
    maxNestingDepth: maxDepth,
    issues,
    score: Math.max(
      0,
      100 - issues.security.length * 20 - issues.complexity.length * 10,
    ),
  };
}
