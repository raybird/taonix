import fs from "fs/promises";
import path from "path";

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
        const ext = path.extname(entry.name);
        obj[entry.name] = ext;
      }
    }
  }

  await walk(directory, result.tree);
  return result;
}
