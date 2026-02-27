import partyCoordinator from "./party-coordinator.js";

class StatusDashboard {
  constructor() {
    this.coordinator = partyCoordinator;
  }

  renderSessionTable(sessions) {
    if (sessions.length === 0) {
      return "📊 目前沒有執行中的會話";
    }

    const header = `| 會話 ID | 狀態 | Agent 數量 | 完成時間 |`;
    const separator = `|---------|------|------------|----------|`;

    const rows = sessions.map((s) => {
      const statusIcon = this.getStatusIcon(s.status);
      const completed = s.completed
        ? new Date(s.completed).toLocaleTimeString()
        : "-";
      return `| ${s.id.substring(0, 8)} | ${statusIcon} ${s.status} | ${s.agentCount} | ${completed} |`;
    });

    return `📊 Party Mode 會話狀態\n\n${header}\n${separator}\n${rows.join("\n")}`;
  }

  getStatusIcon(status) {
    switch (status) {
      case "running":
        return "🔄";
      case "completed":
        return "✅";
      case "failed":
        return "❌";
      default:
        return "⏳";
    }
  }

  renderAgentTable(agents) {
    if (agents.length === 0) {
      return "📋 沒有 Agent 資料";
    }

    const header = `| Agent | 狀態 | 執行時間 |`;
    const separator = `|-------|------|----------|`;

    const rows = agents.map((a) => {
      const statusIcon = this.getStatusIcon(a.status);
      const duration = a.duration ? `${(a.duration / 1000).toFixed(2)}s` : "-";
      return `| ${a.agent} | ${statusIcon} ${a.status} | ${duration} |`;
    });

    return `📋 Agent 詳細狀態\n\n${header}\n${separator}\n${rows.join("\n")}`;
  }

  async getStatus(sessionId = null) {
    if (sessionId) {
      const session = this.coordinator.getSession(sessionId);
      if (!session) {
        return { error: `會話 ${sessionId} 不存在` };
      }

      const agents = this.coordinator.getAgentStatuses(sessionId);
      return {
        session: {
          id: session.id,
          status: session.status,
          task: session.task?.substring(0, 50) + "...",
          created: session.created,
          completed: session.completed,
        },
        agents: agents,
      };
    }

    const sessions = this.coordinator.getAllSessions();
    return {
      sessions: sessions,
      totalSessions: sessions.length,
      activeSessions: sessions.filter((s) => s.status === "running").length,
    };
  }

  async printStatus(sessionId = null) {
    const status = await this.getStatus(sessionId);

    if (status.error) {
      return status.error;
    }

    if (sessionId) {
      const { session, agents } = status;
      let output = `📊 會話詳情: ${session.id}\n`;
      output += `狀態: ${this.getStatusIcon(session.status)} ${session.status}\n`;
      output += `任務: ${session.task}\n`;
      output += `建立時間: ${new Date(session.created).toLocaleString()}\n`;
      output += `\n${this.renderAgentTable(agents)}`;
      return output;
    }

    const { sessions, totalSessions, activeSessions } = status;
    let output = `📊 Taonix Party Mode 儀表板\n`;
    output += `總會話數: ${totalSessions} | 進行中: ${activeSessions}\n\n`;
    output += this.renderSessionTable(sessions);
    return output;
  }

  clearAllSessions() {
    this.coordinator.clearAll();
    return "✅ 已清除所有會話";
  }
}

export const statusDashboard = new StatusDashboard();
export default statusDashboard;
