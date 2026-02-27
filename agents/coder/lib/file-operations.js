import fs from "fs/promises";
import path from "path";

export async function readFile(filepath) {
  const content = await fs.readFile(filepath, "utf-8");
  return content;
}

export async function writeFile(filepath, content) {
  const dir = path.dirname(filepath);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(filepath, content, "utf-8");
}

export async function listFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  return entries.map((entry) => ({
    name: entry.name,
    isDirectory: entry.isDirectory(),
    path: path.join(directory, entry.name),
  }));
}
