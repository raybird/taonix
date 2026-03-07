import { createCapabilitySpec } from "../contracts/capability-spec.js";

export async function loadCapabilityModules(modules = [], registry, telemetry) {
  const failures = [];

  for (const moduleLoader of modules) {
    try {
      const loaded = await moduleLoader();
      const capability = createCapabilitySpec(loaded.default || loaded.capability || loaded);
      registry.registerCapability(capability);
    } catch (error) {
      failures.push({ error: error.message });
      telemetry?.emit("plugin.load_failed", {
        status: "warning",
        payload: { error: error.message },
      });
    }
  }

  return { failures };
}
