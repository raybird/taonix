import { normalizeTaskInput } from "../contracts/task-spec.js";
import { PluginRegistry } from "../plugins/registry.js";
import { loadCapabilityModules } from "../plugins/loader.js";
import { Telemetry } from "../telemetry/index.js";
import { Router } from "./router.js";
import { Dispatcher } from "./dispatcher.js";
import { Executor } from "./executor.js";

const defaultCapabilityModules = [
  () => import("../../capabilities/analyze-structure/index.js"),
  () => import("../../capabilities/check-quality/index.js"),
  () => import("../../capabilities/web-search/index.js"),
  () => import("../../capabilities/github-trending/index.js"),
];

export class TaonixRuntime {
  constructor(options = {}) {
    this.registry = options.registry || new PluginRegistry();
    this.telemetry = options.telemetry || new Telemetry();
    this.router = options.router || new Router(this.registry, options.routerOptions);
    this.executor = options.executor || new Executor();
    this.dispatcher =
      options.dispatcher || new Dispatcher(this.registry, this.executor, this.telemetry, options.dispatcherOptions);
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return this;
    await loadCapabilityModules(defaultCapabilityModules, this.registry, this.telemetry);
    this.initialized = true;
    return this;
  }

  async run(input, options = {}) {
    await this.init();
    const routed = await this.router.route(input, options);
    const result = await this.dispatcher.dispatch(routed.taskSpec, options.context);
    return {
      input: typeof input === "string" ? input : routed.taskSpec.input,
      route: routed.route,
      task: routed.taskSpec,
      result,
    };
  }

  async runTask(taskSpec, options = {}) {
    await this.init();
    const normalized = normalizeTaskInput(taskSpec, options);
    const result = await this.dispatcher.dispatch(normalized, options.context);
    return {
      task: normalized,
      result,
    };
  }

  listCapabilities() {
    return this.registry.listCapabilities();
  }

  doctor() {
    return {
      status: "ok",
      capabilities: this.registry.listCapabilities().map((capability) => capability.name),
      telemetryEvents: this.telemetry.sink.snapshot().length,
    };
  }
}

let runtime;

export async function createRuntime(options = {}) {
  runtime = runtime || new TaonixRuntime(options);
  await runtime.init();
  return runtime;
}

export async function run(input, options = {}) {
  const instance = await createRuntime(options);
  return instance.run(input, options);
}

export async function runTask(taskSpec, options = {}) {
  const instance = await createRuntime(options);
  return instance.runTask(taskSpec, options);
}
