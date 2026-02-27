class SuggestionEngine {
  constructor() {
    this.suggestions = [];
    this.context = {};
    this.history = [];
  }

  setContext(key, value) {
    this.context[key] = value;
  }

  addSuggestion(suggestion) {
    const id = `sug_${Date.now()}`;
    const item = {
      id,
      ...suggestion,
      created: new Date().toISOString(),
      dismissed: false,
    };
    this.suggestions.push(item);
    return item;
  }

  getActiveSuggestions() {
    return this.suggestions.filter((s) => !s.dismissed);
  }

  dismissSuggestion(id) {
    const suggestion = this.suggestions.find((s) => s.id === id);
    if (suggestion) {
      suggestion.dismissed = true;
    }
    return suggestion;
  }

  analyzePatterns() {
    const patterns = {
      frequentSkills: this.getFrequentSkills(),
      timePatterns: this.getTimePatterns(),
      commonGoals: this.getCommonGoals(),
    };
    return patterns;
  }

  getFrequentSkills() {
    const skillCounts = {};
    this.history.forEach((h) => {
      if (h.skill) {
        skillCounts[h.skill] = (skillCounts[h.skill] || 0) + 1;
      }
    });
    return Object.entries(skillCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([skill, count]) => ({ skill, count }));
  }

  getTimePatterns() {
    const hourCounts = {};
    this.history.forEach((h) => {
      const hour = new Date(h.timestamp).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });
    return hourCounts;
  }

  getCommonGoals() {
    return [];
  }

  generateSuggestions() {
    const patterns = this.analyzePatterns();
    const suggestions = [];

    if (patterns.frequentSkills.length > 0) {
      suggestions.push({
        type: "skill",
        priority: "high",
        title: "常用技能快捷",
        description: `你經常使用 ${patterns.frequentSkills[0].skill}，建議設定快捷鍵`,
        action: "setting_shortcut",
      });
    }

    suggestions.push({
      type: "optimization",
      priority: "medium",
      title: "排程優化",
      description: "根據你的工作時間模式，建議調整排程時間",
      action: "adjust_schedule",
    });

    return suggestions;
  }

  recordAction(action, metadata = {}) {
    this.history.push({
      action,
      ...metadata,
      timestamp: new Date().toISOString(),
    });
  }
}

export const suggestionEngine = new SuggestionEngine();
export default suggestionEngine;
