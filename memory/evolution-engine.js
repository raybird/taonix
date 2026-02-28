import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EVOLUTION_DIR = path.join(__dirname, "../.data/evolution");

class EvolutionEngine {
  constructor() {
    this.evolutionHistory = [];
    this.adaptations = new Map();
    this.feedbackPatterns = new Map();
    this.selfImprovements = [];
    this.ensureEvolutionDir();
    this.load();
  }

  ensureEvolutionDir() {
    if (!fs.existsSync(EVOLUTION_DIR)) {
      fs.mkdirSync(EVOLUTION_DIR, { recursive: true });
    }
  }

  load() {
    const historyFile = path.join(EVOLUTION_DIR, "history.json");
    const adaptationsFile = path.join(EVOLUTION_DIR, "adaptations.json");
    const patternsFile = path.join(EVOLUTION_DIR, "patterns.json");
    const improvementsFile = path.join(EVOLUTION_DIR, "improvements.json");

    if (fs.existsSync(historyFile)) {
      this.evolutionHistory = JSON.parse(fs.readFileSync(historyFile, "utf-8"));
    }
    if (fs.existsSync(adaptationsFile)) {
      const data = JSON.parse(fs.readFileSync(adaptationsFile, "utf-8"));
      this.adaptations = new Map(Object.entries(data));
    }
    if (fs.existsSync(patternsFile)) {
      const data = JSON.parse(fs.readFileSync(patternsFile, "utf-8"));
      this.feedbackPatterns = new Map(Object.entries(data));
    }
    if (fs.existsSync(improvementsFile)) {
      this.selfImprovements = JSON.parse(
        fs.readFileSync(improvementsFile, "utf-8"),
      );
    }
  }

  save() {
    const historyFile = path.join(EVOLUTION_DIR, "history.json");
    const adaptationsFile = path.join(EVOLUTION_DIR, "adaptations.json");
    const patternsFile = path.join(EVOLUTION_DIR, "patterns.json");
    const improvementsFile = path.join(EVOLUTION_DIR, "improvements.json");

    fs.writeFileSync(
      historyFile,
      JSON.stringify(this.evolutionHistory, null, 2),
    );
    fs.writeFileSync(
      adaptationsFile,
      JSON.stringify(Object.fromEntries(this.adaptations)),
    );
    fs.writeFileSync(
      patternsFile,
      JSON.stringify(Object.fromEntries(this.feedbackPatterns)),
    );
    fs.writeFileSync(
      improvementsFile,
      JSON.stringify(this.selfImprovements, null, 2),
    );
  }

  recordFeedback(feedback) {
    const { type, content, agent, result, rating } = feedback;

    const pattern = {
      id: `fb_${Date.now()}`,
      type,
      content: content?.substring(0, 200),
      agent,
      result,
      rating,
      timestamp: new Date().toISOString(),
      processed: false,
    };

    this.feedbackPatterns.set(pattern.id, pattern);
    this.analyzeFeedback(pattern);
    this.save();

    return pattern;
  }

  analyzeFeedback(feedback) {
    if (feedback.rating && feedback.rating < 3) {
      const key = feedback.agent || feedback.type;
      const count = this.feedbackPatterns.get(key)?.count || 0;
      this.feedbackPatterns.set(key, {
        ...feedback,
        count: count + 1,
        needsAdjustment: true,
      });
    }
  }

  recordEvolution(evolution) {
    const record = {
      id: `evo_${Date.now()}`,
      version: evolution.version,
      changes: evolution.changes,
      trigger: evolution.trigger,
      timestamp: new Date().toISOString(),
      status: "completed",
    };

    this.evolutionHistory.push(record);
    this.save();

    return record;
  }

  adaptBehavior(agent, context, outcome) {
    const adaptation = {
      agent,
      context: context.substring(0, 100),
      outcome,
      adapted: true,
      timestamp: new Date().toISOString(),
    };

    const key = `${agent}_${Date.now()}`;
    this.adaptations.set(key, adaptation);

    if (outcome === "success") {
      this.selfImprovements.push({
        type: "positive_adaptation",
        agent,
        context: context.substring(0, 50),
        timestamp: new Date().toISOString(),
      });
    }

    this.save();
    return adaptation;
  }

  getAdaptiveSuggestions() {
    const suggestions = [];

    const negativePatterns = Array.from(this.feedbackPatterns.values()).filter(
      (p) => p.needsAdjustment,
    );

    for (const pattern of negativePatterns) {
      suggestions.push({
        type: "behavior_adjustment",
        agent: pattern.agent,
        issue: pattern.content,
        priority: "high",
        timestamp: pattern.timestamp,
      });
    }

    const recentImprovements = this.selfImprovements.slice(-5);
    if (recentImprovements.length > 0) {
      suggestions.push({
        type: "positive_pattern",
        improvements: recentImprovements,
        priority: "medium",
      });
    }

    return suggestions.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }

  analyzePerformance() {
    const totalFeedback = this.feedbackPatterns.size;
    const positiveFeedback = Array.from(this.feedbackPatterns.values()).filter(
      (f) => f.rating >= 4,
    ).length;
    const negativeFeedback = Array.from(this.feedbackPatterns.values()).filter(
      (f) => f.rating && f.rating < 3,
    ).length;

    const successRate =
      totalFeedback > 0
        ? Math.round((positiveFeedback / totalFeedback) * 100)
        : 100;

    const adaptations = this.adaptations.size;
    const improvements = this.selfImprovements.length;

    return {
      totalFeedback,
      positiveFeedback,
      negativeFeedback,
      successRate,
      adaptations,
      improvements,
      evolutionCount: this.evolutionHistory.length,
      health:
        successRate >= 70
          ? "healthy"
          : successRate >= 50
            ? "warning"
            : "critical",
    };
  }

  getEvolutionHistory() {
    return this.evolutionHistory;
  }

  getStats() {
    return {
      feedbackCount: this.feedbackPatterns.size,
      adaptationCount: this.adaptations.size,
      improvementCount: this.selfImprovements.length,
      evolutionCount: this.evolutionHistory.length,
    };
  }

  clearOldData(daysToKeep = 30) {
    const cutoff = Date.now() - daysToKeep * 24 * 60 * 60 * 1000;

    for (const [key, value] of this.feedbackPatterns) {
      if (new Date(value.timestamp).getTime() < cutoff) {
        this.feedbackPatterns.delete(key);
      }
    }

    this.save();
  }
}

export const evolutionEngine = new EvolutionEngine();
