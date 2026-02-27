import { execSync } from "child_process";

export async function runTests(testPath, coverage = false) {
  const startTime = Date.now();

  let command = "npm test";
  if (coverage) {
    command += " -- --coverage";
  }

  try {
    const output = execSync(command, {
      cwd: testPath === "./test" ? "." : testPath,
      encoding: "utf-8",
      stdio: "pipe",
    });

    return {
      success: true,
      duration: Date.now() - startTime,
      output: output.substring(0, 2000),
    };
  } catch (error) {
    return {
      success: false,
      duration: Date.now() - startTime,
      error: error.message,
      output: error.stdout?.substring(0, 2000) || "",
    };
  }
}
