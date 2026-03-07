import { createEventSpec } from "../contracts/event-spec.js";
import { InMemoryEventSink } from "./event-sink.js";
import { TaskLog } from "./task-log.js";
import { TraceLog } from "./trace-log.js";

export class Telemetry {
  constructor({ sink } = {}) {
    this.sink = sink || new InMemoryEventSink();
    this.taskLog = new TaskLog(this.sink);
    this.traceLog = new TraceLog(this.sink);
  }

  emit(type, event = {}) {
    const normalized = createEventSpec({ type, ...event });
    this.sink.write(normalized);
    return normalized;
  }

  startTask(taskSpec, handler) {
    const startedAt = new Date().toISOString();
    this.taskLog.record({
      taskId: taskSpec.id,
      traceId: taskSpec.traceId,
      capability: taskSpec.capability,
      handler,
      started_at: startedAt,
      status: "started",
      error: null,
    });
    this.traceLog.record({
      traceId: taskSpec.traceId,
      taskId: taskSpec.id,
      capability: taskSpec.capability,
      status: "started",
      handler,
    });
    return startedAt;
  }

  finishTask(taskSpec, handler, startedAt, result) {
    const duration = Date.now() - Date.parse(startedAt);
    const error = result.error?.message || null;
    this.taskLog.record({
      taskId: taskSpec.id,
      traceId: taskSpec.traceId,
      capability: taskSpec.capability,
      handler,
      started_at: startedAt,
      duration,
      status: result.status,
      error,
    });
    this.traceLog.record({
      traceId: taskSpec.traceId,
      taskId: taskSpec.id,
      capability: taskSpec.capability,
      status: result.status,
      handler,
      duration,
      error,
    });
  }
}
