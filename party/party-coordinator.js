import { listAgents } from "../ai-engine/lib/agent-dispatch.js";

class PartyModeCoordinator {
  constructor() {
    this.sessions = new Map();
    this.maxConcurrent = 4;
    this.timeout = 120000;
  }

  createSession(sessionId) {
    const session = {
      id: sessionId,
      agents: [],
      results: [],
      status: "pending",
      created: new Date().toISOString(),
      completed: null,
    };
    this.sessions.set(sessionId, session);
    return session;
  }

  async executeParty(agentList, task, options = {}) {
    const sessionId = options.sessionId || `party_${Date.now()}`;
    const session = this.createSession(sessionId);

    session.agents = agentList.map((agent) => ({
      agent,
      status: "pending",
      startTime: null,
      endTime: null,
      result: null,
      error: null,
    }));

    session.status = "running";
    session.task = task;

    const promises = agentList.map(async (agent, index) => {
      const agentEntry = session.agents[index];
      agentEntry.status = "running";
      agentEntry.startTime = new Date().toISOString();

      try {
        const result = await this.executeAgent(Agent, task, options);
        agentEntry.status = "completed";
        agentEntry.result = result;
        session.results.push({ agent: Agent, result });
      } catch (error) {
        agentEntry.status = "failed";
        agentEntry.error = error.message;
        session.results.push({ agent: Agent, error: error.message });
      } finally {
        agentEntry.endTime = new Date().toISOString();
      }
    });

    try {
      await Promise.race([
        Promise.all(promises),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Timeout")), this.timeout),
        ),
      ]);
      session.status = "completed";
    } catch (error) {
      session.status = "failed";
      session.error = error.message;
    }

    session.completed = new Date().toISOString();
    return this.getSession(sessionId);
  }

  async executeAgent(Agent, task, options) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          agent: Agent,
          output: `Executed ${Agent} for task: ${task.substring(0, 50)}...`,
        });
      }, 100);
    });
  }

  getSession(sessionId) {
    return this.sessions.get(sessionId) || null;
  }

  getAllSessions() {
    return Array.from(this.sessions.values()).map((s) => ({
      id: s.id,
      status: s.status,
      agentCount: s.agents.length,
      completed: s.completed,
    }));
  }

  getAgentStatuses(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) return [];
    return session.agents.map((a) => ({
      agent: a.agent,
      status: a.status,
      duration:
        a.endTime && a.startTime
          ? new Date(a.endTime) - new Date(a.startTime)
          : null,
    }));
  }

  clearSession(sessionId) {
    this.sessions.delete(sessionId);
  }

  clearAll() {
    this.sessions.clear();
  }
}

export const partyCoordinator = new PartyModeCoordinator();
export default partyCoordinator;
