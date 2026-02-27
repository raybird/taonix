import fs from "fs/promises";

export async function checkLogic(filepath) {
  const content = await fs.readFile(filepath, "utf-8");
  const lines = content.split("\n");

  const issues = [];
  let braceCount = 0;
  let parenCount = 0;
  let bracketCount = 0;

  lines.forEach((line, index) => {
    for (const char of line) {
      if (char === "{") braceCount++;
      if (char === "}") braceCount--;
      if (char === "(") parenCount++;
      if (char === ")") parenCount--;
      if (char === "[") bracketCount++;
      if (char === "]") bracketCount--;
    }

    if (line.includes("if") && !line.includes("else") && !line.includes("}")) {
      const nextLine = lines[index + 1];
      if (nextLine && !nextLine.includes("{")) {
        issues.push({
          line: index + 1,
          type: "warning",
          message: "if 區塊缺少 { ",
        });
      }
    }
  });

  if (braceCount !== 0) {
    issues.push({
      line: "global",
      type: "error",
      message: `大括號不平衡 (差異: ${braceCount})`,
    });
  }
  if (parenCount !== 0) {
    issues.push({
      line: "global",
      type: "error",
      message: `小括號不平衡 (差異: ${parenCount})`,
    });
  }
  if (bracketCount !== 0) {
    issues.push({
      line: "global",
      type: "error",
      message: `中括號不平衡 (差異: ${bracketCount})`,
    });
  }

  return {
    filepath,
    totalLines: lines.length,
    balance: { braces: braceCount, parens: parenCount, brackets: bracketCount },
    issues,
    isValid: issues.filter((i) => i.type === "error").length === 0,
  };
}
