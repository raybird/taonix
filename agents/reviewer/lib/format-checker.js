import fs from "fs/promises";

export async function checkFormat(filepath) {
  const content = await fs.readFile(filepath, "utf-8");
  const lines = content.split("\n");

  const issues = [];

  lines.forEach((line, index) => {
    if (line.length > 120) {
      issues.push({
        line: index + 1,
        type: "warning",
        message: `行過長 (${line.length} 字元)`,
      });
    }

    if (line.includes("\t")) {
      issues.push({
        line: index + 1,
        type: "info",
        message: "使用 Tab 而非空格",
      });
    }

    if (line.endsWith(" ") || line.endsWith("\t")) {
      issues.push({ line: index + 1, type: "info", message: "行尾有多餘空白" });
    }
  });

  const hasFinalNewline = content.endsWith("\n");
  if (!hasFinalNewline) {
    issues.push({
      line: "EOF",
      type: "warning",
      message: "檔案結尾缺少換行符號",
    });
  }

  return {
    filepath,
    totalLines: lines.length,
    issues,
    formatted: issues.filter((i) => i.type === "warning").length === 0,
  };
}
