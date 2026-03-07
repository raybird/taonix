export class Executor {
  async execute(capability, taskSpec, context) {
    return capability.handler(taskSpec, context);
  }
}
