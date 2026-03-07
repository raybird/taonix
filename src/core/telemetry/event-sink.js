export class InMemoryEventSink {
  constructor() {
    this.events = [];
  }

  write(event) {
    this.events.push(event);
  }

  snapshot() {
    return [...this.events];
  }
}
