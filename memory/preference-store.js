import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "../.data");

class PreferenceStore {
  constructor() {
    this.preferences = new Map();
    this.stats = new Map();
    this.userProfile = {
      name: null,
      timezone: "Asia/Taipei",
      language: "zh-TW",
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
    };
    this.workflows = new Map();
    this.ensureDataDir();
    this.load();
  }

  ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  load() {
    const prefFile = path.join(DATA_DIR, "preferences.json");
    const statsFile = path.join(DATA_DIR, "stats.json");
    const profileFile = path.join(DATA_DIR, "user-profile.json");
    const workflowsFile = path.join(DATA_DIR, "workflows.json");

    if (fs.existsSync(prefFile)) {
      const data = JSON.parse(fs.readFileSync(prefFile, "utf-8"));
      this.preferences = new Map(Object.entries(data));
    }

    if (fs.existsSync(statsFile)) {
      const data = JSON.parse(fs.readFileSync(statsFile, "utf-8"));
      this.stats = new Map(Object.entries(data));
    }

    if (fs.existsSync(profileFile)) {
      const data = JSON.parse(fs.readFileSync(profileFile, "utf-8"));
      this.userProfile = { ...this.userProfile, ...data };
    }

    if (fs.existsSync(workflowsFile)) {
      const data = JSON.parse(fs.readFileSync(workflowsFile, "utf-8"));
      this.workflows = new Map(Object.entries(data));
    }
  }

  save() {
    const prefFile = path.join(DATA_DIR, "preferences.json");
    const statsFile = path.join(DATA_DIR, "stats.json");
    const profileFile = path.join(DATA_DIR, "user-profile.json");
    const workflowsFile = path.join(DATA_DIR, "workflows.json");

    fs.writeFileSync(
      prefFile,
      JSON.stringify(Object.fromEntries(this.preferences)),
    );
    fs.writeFileSync(statsFile, JSON.stringify(Object.fromEntries(this.stats)));
    fs.writeFileSync(profileFile, JSON.stringify(this.userProfile, null, 2));
    fs.writeFileSync(
      workflowsFile,
      JSON.stringify(Object.fromEntries(this.workflows), null, 2),
    );
  }

  setUserProfile(key, value) {
    this.userProfile[key] = value;
    this.userProfile.lastActive = new Date().toISOString();
    this.save();
  }

  getUserProfile() {
    return { ...this.userProfile };
  }

  recordWorkflow(workflowId, steps) {
    const existing = this.workflows.get(workflowId) || { count: 0, steps: [] };
    existing.count += 1;
    existing.lastUsed = new Date().toISOString();
    this.workflows.set(workflowId, existing);
    this.save();
  }

  getTopWorkflows(limit = 5) {
    return Array.from(this.workflows.entries())
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, limit)
      .map(([id, v]) => ({ id, count: v.count, lastUsed: v.lastUsed }));
  }

  set(key, value) {
    this.preferences.set(key, value);
    this.save();
  }

  get(key, defaultValue = null) {
    return this.preferences.get(key) || defaultValue;
  }

  record(skill, agents) {
    const key = `skill:${skill}`;
    const count = this.stats.get(key) || 0;
    this.stats.set(key, count + 1);

    if (agents && agents.length > 0) {
      for (const agent of agents) {
        const agentKey = `agent:${agent}`;
        const agentCount = this.stats.get(agentKey) || 0;
        this.stats.set(agentKey, agentCount + 1);
      }
    }

    this.save();
  }

  getTopSkills(limit = 5) {
    const entries = Array.from(this.stats.entries())
      .filter(([k]) => k.startsWith("skill:"))
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit);
    return entries.map(([k, v]) => ({
      skill: k.replace("skill:", ""),
      count: v,
    }));
  }

  getTopAgents(limit = 5) {
    const entries = Array.from(this.stats.entries())
      .filter(([k]) => k.startsWith("agent:"))
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit);
    return entries.map(([k, v]) => ({
      agent: k.replace("agent:", ""),
      count: v,
    }));
  }

  getStats() {
    return {
      topSkills: this.getTopSkills(),
      topAgents: this.getTopAgents(),
      totalInteractions: Array.from(this.stats.values()).reduce(
        (a, b) => a + b,
        0,
      ),
    };
  }
}

export const preferenceStore = new PreferenceStore();
export default preferenceStore;
