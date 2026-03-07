export class PluginRegistry {
  constructor() {
    this.capabilities = new Map();
  }

  registerCapability(spec) {
    this.capabilities.set(spec.name, spec);
    return spec;
  }

  getCapability(name) {
    return this.capabilities.get(name) || null;
  }

  listCapabilities() {
    return [...this.capabilities.values()];
  }
}
