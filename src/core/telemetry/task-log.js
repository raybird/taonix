export class TaskLog {
  constructor(sink) {
    this.sink = sink;
  }

  record(entry) {
    this.sink.write({ channel: "task_log", ...entry });
  }
}
