export class TraceLog {
  constructor(sink) {
    this.sink = sink;
  }

  record(entry) {
    this.sink.write({ channel: "trace_log", ...entry });
  }
}
