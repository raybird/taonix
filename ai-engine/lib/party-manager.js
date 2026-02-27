class PartyManager {
  constructor() {
    this.activeSessions = new Map();
    this.maxConcurrent = 4;
    this.timeout = 120000;
  }

  async executeParty(task, agents) {
    const sessionId = `party_${Date.now()}`;
    const startTime = Date.now();

    const session = {
      id: sessionId,
      task,
      agents,
      status: "running",
      results: [],
      errors: [],
      startTime,
    };

    this.activeSessions.set(sessionId, session);

    try {
      const promises = agents.map(async (agent) => {
        try {
          const result = await this.executeAgent(agent, task);
          session.results.push({ agent: agent.agent, result, success: true });
          return { agent: agent.agent, result, success: true };
        } catch (error) {
          session.errors.push({ agent: agent.agent, error: error.message });
          return { agent: agent.agent, error: error.message, success: false };
        }
      });

      const results = await Promise.allSettled(promises);

      session.status = results.every((r) => r.status === "fulfilled")
        ? "completed"
        : "partial";

      session.endTime = Date.now();
      session.duration = session.endTime - session.startTime;

      return {
        sessionId,
        status: session.status,
        results: session.results,
        errors: session.errors,
        duration: session.duration,
      };
    } catch (error) {
      session.status = "failed";
      session.errors.push({ error: error.message });
      return { sessionId, status: "failed", errors: [error.message] };
    }
  }

  async executeAgent(agent, task) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error(`Agent ${agent.agent} timeout`));
      }, this.timeout);

      try {
        const result = this.callAgent(agent, task);
        clearTimeout(timeout);
        resolve(result);
      } catch (error) {
        clearTimeout(timeout);
        reject(error);
      }
    });
  }

  callAgent(agent, task) {
    return { agent: agent.agent, output: `Executed by ${agent.name}` };
  }

  getSession(sessionId) {
    return this.activeSessions.get(sessionId) || null;
  }

  getActiveSessions() {
    return Array.from(this.activeSessions.values()).map((s) => ({
      id: s.id,
      status: s.status,
      agentCount: s.agents.length,
      duration: s.duration,
    }));
  }

  cancelSession(sessionId) {
    const session = this.activeSessions.get(sessionId);
    if (session && session.status === "running") {
      session.status = "cancelled";
      return true;
    }
    return false;
  }
}

export const partyManager = new PartyManager();
export default partyManager;
