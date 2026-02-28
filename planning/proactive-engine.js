export class ProactiveSuggestionEngine {
  constructor() {
    this.suggestions = [];
    this.history = [];
    this.weights = {
      frequency: 1.0,
      recency: 1.5,
      preference: 2.0,
    };
  }

  addSuggestion(suggestion) {
    const s = {
      id: `sug_${Date.now()}`,
      text: suggestion.text,
      context: suggestion.context || "",
      category: suggestion.category || "general",
      priority: suggestion.priority || "medium",
      created: new Date().toISOString(),
      triggered: false,
    };
    this.suggestions.push(s);
    return s;
  }

  recordAction(action) {
    this.history.push({
      action,
      timestamp: new Date().toISOString(),
    });
    this.updateSuggestionWeights(action);
  }

  updateSuggestionWeights(action) {
    this.suggestions.forEach((s) => {
      if (s.text.toLowerCase().includes(action.toLowerCase())) {
        s.priority = s.priority === "low" ? "medium" : "high";
      }
    });
  }

  getSuggestions(context = "") {
    return this.suggestions
      .filter((s) => !s.triggered)
      .sort((a, b) => {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      })
      .slice(0, 5);
  }

  triggerSuggestion(suggestionId) {
    const suggestion = this.suggestions.find((s) => s.id === suggestionId);
    if (suggestion) {
      suggestion.triggered = true;
      suggestion.triggeredAt = new Date().toISOString();
    }
    return suggestion;
  }

  analyzePatterns() {
    const actionCounts = {};
    this.history.forEach((h) => {
      actionCounts[h.action] = (actionCounts[h.action] || 0) + 1;
    });

    const patterns = Object.entries(actionCounts)
      .map(([action, count]) => ({ action, count }))
      .sort((a, b) => b.count - a.count);

    return {
      totalActions: this.history.length,
      uniqueActions: patterns.length,
      topActions: patterns.slice(0, 5),
    };
  }
}

export const proactiveEngine = new ProactiveSuggestionEngine();
export default proactiveEngine;
