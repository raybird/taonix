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

    const { passed, failed } = parseTestOutput(output);

    return {
      success: true,
      passed,
      failed,
      total: passed + failed,
      duration: Date.now() - startTime,
      output: output.substring(0, 2000),
    };
  } catch (error) {
    const output = error.stdout?.substring(0, 2000) || "";
    const { passed, failed } = parseTestOutput(output);

    return {
      success: false,
      passed,
      failed,
      total: passed + failed,
      duration: Date.now() - startTime,
      error: error.message,
      output,
    };
  }
}

function parseTestOutput(output) {
  const passMatch = output.match(/# pass (\d+)/);
  const failMatch = output.match(/# fail (\d+)/);
  return {
    passed: passMatch ? parseInt(passMatch[1], 10) : 0,
    failed: failMatch ? parseInt(failMatch[1], 10) : 0,
  };
}
