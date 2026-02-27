import fs from "fs/promises";

export async function codeReview(filepath) {
  const content = await fs.readFile(filepath, "utf-8");
  const ext = filepath.split(".").pop();

  const issues = [];
  const lines = content.split("\n");

  lines.forEach((line, index) => {
    if (line.length > 120) {
      issues.push({
        line: index + 1,
        severity: "warning",
        message: `Line too long (${line.length} chars)`,
      });
    }
    if (line.includes("console.log") && ext === "js") {
      issues.push({
        line: index + 1,
        severity: "info",
        message: "Console.log found - consider removing for production",
      });
    }
    if (line.includes("TODO") || line.includes("FIXME")) {
      issues.push({
        line: index + 1,
        severity: "info",
        message: "TODO/FIXME comment found",
      });
    }
  });

  return {
    filepath,
    totalLines: lines.length,
    issues,
    summary: {
      errors: issues.filter((i) => i.severity === "error").length,
      warnings: issues.filter((i) => i.severity === "warning").length,
      info: issues.filter((i) => i.severity === "info").length,
    },
  };
}
