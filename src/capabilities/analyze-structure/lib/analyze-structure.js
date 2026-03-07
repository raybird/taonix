import fs from "node:fs/promises";
import path from "node:path";

export async function analyzeStructure(directory) {
  const result = {
    directory,
    tree: {},
    fileCount: 0,
    dirCount: 0,
  };

  async function walk(dir, obj = {}) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.startsWith(".") || entry.name === "node_modules") continue;

      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        result.dirCount++;
        obj[entry.name] = {};
        await walk(fullPath, obj[entry.name]);
      } else {
        result.fileCount++;
        obj[entry.name] = path.extname(entry.name);
      }
    }
  }

  await walk(directory, result.tree);
  return result;
}
