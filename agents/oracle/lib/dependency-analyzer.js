import fs from "fs/promises";
import path from "path";

export async function analyzeDependencies(directory) {
  const packageJsonPath = path.join(directory, "package.json");

  try {
    const content = await fs.readFile(packageJsonPath, "utf-8");
    const pkg = JSON.parse(content);

    return {
      name: pkg.name,
      version: pkg.version,
      dependencies: pkg.dependencies || {},
      devDependencies: pkg.devDependencies || {},
      totalDependencies: Object.keys(pkg.dependencies || {}).length,
      totalDevDependencies: Object.keys(pkg.devDependencies || {}).length,
    };
  } catch (error) {
    return {
      error: "package.json not found or invalid",
      directory,
    };
  }
}
