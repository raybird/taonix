import { spawn } from "child_process";
import path from "path";
import { createResultSpec } from "../contracts/result-spec.js";
import { createChildPayload, parseChildResult } from "./child-protocol.js";

export class Dispatcher {
  constructor(registry, executor, telemetry, options = {}) {
    this.registry = registry;
    this.executor = executor;
    this.telemetry = telemetry;
    this.timeoutMs = options.timeoutMs || 30_000;
    this.retryCount = options.retryCount || 0;
    this.agentsDir = options.agentsDir || path.join(process.cwd(), "agents");
  }

  async dispatch(taskSpec, context = {}) {
    const capability = this.registry.getCapability(taskSpec.capability);
    const handler = capability?.name || taskSpec.capability;
    const startedAt = this.telemetry.startTask(taskSpec, handler);

    let result;
    try {
      if (capability?.handler) {
        const data = await this.executor.execute(capability, taskSpec, context);
        result = createResultSpec(taskSpec, {
          success: true,
          status: "completed",
          data,
          executionMode: "in_process",
          meta: { handler: capability.name },
        });
      } else if (capability?.fallback?.agent) {
        result = await this.dispatchViaChildProcess(taskSpec, capability.fallback);
      } else {
        result = createResultSpec(taskSpec, {
          success: false,
          status: "failed",
          error: {
            code: "CAPABILITY_NOT_AVAILABLE",
            message: `No registered handler for capability: ${taskSpec.capability}`,
          },
        });
      }
    } catch (error) {
      result = createResultSpec(taskSpec, {
        success: false,
        status: "failed",
        error: {
          code: error.code || "EXECUTION_FAILED",
          message: error.message,
        },
      });
    }

    this.telemetry.finishTask(taskSpec, handler, startedAt, result);
    return result;
  }

  async dispatchViaChildProcess(taskSpec, fallback) {
    const payload = createChildPayload(taskSpec, {
      timeoutMs: fallback.timeoutMs || this.timeoutMs,
      retryCount: fallback.retryCount || this.retryCount,
    });

    const script = fallback.script || path.join(this.agentsDir, fallback.agent, "index.js");
    return new Promise((resolve) => {
      const child = spawn("node", [script, taskSpec.capability], {
        stdio: "pipe",
        env: { ...process.env, TAONIX_CHILD_PROTOCOL: "1" },
      });
      let stdout = "";
      let stderr = "";

      const timer = setTimeout(() => {
        child.kill();
        resolve(
          createResultSpec(taskSpec, {
            success: false,
            status: "failed",
            executionMode: "child_process",
            error: {
              code: "CHILD_TIMEOUT",
              message: `Child process timed out after ${payload.policy.timeoutMs}ms`,
            },
          }),
        );
      }, payload.policy.timeoutMs);

      child.stdout.on("data", (chunk) => {
        stdout += chunk.toString();
      });
      child.stderr.on("data", (chunk) => {
        stderr += chunk.toString();
      });
      child.on("close", (code) => {
        clearTimeout(timer);
        const parsed = parseChildResult(stdout);

        if (parsed?.result) {
          resolve(
            createResultSpec(taskSpec, {
              success: Boolean(parsed.result.success),
              status: parsed.result.status || (parsed.result.success ? "completed" : "failed"),
              executionMode: "child_process",
              data: parsed.result.data ?? null,
              error: parsed.result.error ?? null,
              meta: {
                protocolVersion: payload.version,
                protocolMode: parsed.protocol,
                exitCode: code,
              },
            }),
          );
          return;
        }

        if (parsed?.error) {
          resolve(
            createResultSpec(taskSpec, {
              success: false,
              status: "failed",
              executionMode: "child_process",
              error: {
                code: "CHILD_PROTOCOL_ERROR",
                message: parsed.error.message,
              },
            }),
          );
          return;
        }

        resolve(
          createResultSpec(taskSpec, {
            success: code === 0,
            status: code === 0 ? "completed" : "failed",
            executionMode: "child_process",
            data: code === 0 ? { stdout: stdout.trim() } : null,
            error: code === 0 ? null : { code: "CHILD_EXIT_NONZERO", message: stderr.trim() || stdout.trim() },
            meta: { protocolVersion: payload.version, exitCode: code },
          }),
        );
      });

      child.stdin.write(JSON.stringify(payload));
      child.stdin.end();
    });
  }
}
