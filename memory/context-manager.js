import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "../.data");

class ContextManager {
  constructor() {
    this.currentSession = null;
    this.contexts = new Map();
    this.maxContexts = 10;
    this.maxMessagesPerContext = 50;
    this.ensureDataDir();
    this.load();
  }

  ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  load() {
    const contextsFile = path.join(DATA_DIR, "contexts.json");
    if (fs.existsSync(contextsFile)) {
      const data = JSON.parse(fs.readFileSync(contextsFile, "utf-8"));
      this.contexts = new Map(Object.entries(data.contexts || {}));
      this.currentSession = data.currentSession;
    }
  }

  save() {
    const contextsFile = path.join(DATA_DIR, "contexts.json");
    const data = {
      currentSession: this.currentSession,
      contexts: Object.fromEntries(this.contexts),
    };
    fs.writeFileSync(contextsFile, JSON.stringify(data, null, 2));
  }

  createSession(sessionId) {
    this.currentSession = sessionId;
    this.contexts.set(sessionId, {
      id: sessionId,
      created: new Date().toISOString(),
      messages: [],
      metadata: {},
    });
    this.cleanupOldContexts();
    this.save();
    return this.getContext(sessionId);
  }

  addMessage(sessionId, role, content, metadata = {}) {
    if (!this.contexts.has(sessionId)) {
      this.createSession(sessionId);
    }

    const context = this.contexts.get(sessionId);
    context.messages.push({
      role,
      content: content.substring(0, 2000),
      timestamp: new Date().toISOString(),
      metadata,
    });

    if (context.messages.length > this.maxMessagesPerContext) {
      context.messages = context.messages.slice(-this.maxMessagesPerContext);
    }

    this.save();
  }

  getContext(sessionId) {
    return this.contexts.get(sessionId) || null;
  }

  getRecentMessages(sessionId, limit = 10) {
    const context = this.contexts.get(sessionId);
    if (!context) return [];
    return context.messages.slice(-limit);
  }

  setMetadata(sessionId, key, value) {
    const context = this.contexts.get(sessionId);
    if (context) {
      context.metadata[key] = value;
      this.save();
    }
  }

  getMetadata(sessionId, key, defaultValue = null) {
    const context = this.contexts.get(sessionId);
    return context?.metadata?.[key] ?? defaultValue;
  }

  getAllSessions() {
    return Array.from(this.contexts.values()).map((c) => ({
      id: c.id,
      created: c.created,
      messageCount: c.messages.length,
    }));
  }

  cleanupOldContexts() {
    if (this.contexts.size > this.maxContexts) {
      const entries = Array.from(this.contexts.entries());
      entries.sort((a, b) => new Date(a[1].created) - new Date(b[1].created));
      const toRemove = entries.slice(0, entries.length - this.maxContexts);
      for (const [id] of toRemove) {
        this.contexts.delete(id);
      }
    }
  }

  clearSession(sessionId) {
    this.contexts.delete(sessionId);
    this.save();
  }
}

export const contextManager = new ContextManager();
export default contextManager;
