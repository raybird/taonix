import { evolutionEngine } from "./evolution-engine.js";

class ConversationSummarizer {
  constructor() {
    this.summaries = new Map();
    this.keyPoints = [];
    this.actionItems = [];
  }

  async summarize(conversation) {
    const { messages, context } = conversation;

    const summary = {
      id: `sum_${Date.now()}`,
      messageCount: messages.length,
      participants: this.extractParticipants(messages),
      topics: this.extractTopics(messages),
      sentiment: this.analyzeSentiment(messages),
      keyPoints: this.extractKeyPoints(messages),
      actionItems: this.extractActionItems(messages),
      context,
      timestamp: new Date().toISOString(),
    };

    this.summaries.set(summary.id, summary);
    this.updateTracking(summary);

    return summary;
  }

  extractParticipants(messages) {
    const participants = new Set();
    for (const msg of messages) {
      if (msg.role) participants.add(msg.role);
    }
    return Array.from(participants);
  }

  extractTopics(messages) {
    const topicKeywords = {
      規劃: /規劃|計劃|roadmap/i,
      開發: /開發|開發|implement|build/i,
      除錯: /bug|除錯|debug|error/i,
      審查: /審查|review|檢查/i,
      測試: /測試|test/i,
      設計: /設計|design|ui|ux/i,
      排程: /排程|schedule|cron/i,
      記憶: /記憶|memory|記住/i,
    };

    const topics = [];
    const text = messages.map((m) => m.content || m.text || "").join(" ");

    for (const [topic, regex] of Object.entries(topicKeywords)) {
      if (regex.test(text)) {
        topics.push(topic);
      }
    }

    return topics;
  }

  analyzeSentiment(messages) {
    const positivePatterns = /很好|不錯|棒|感謝|謝謝|正確|同意|好喔|可以/i;
    const negativePatterns = /不好|錯誤|不對|不要|別|停止|取消|廢話|太差/i;

    let positive = 0;
    let negative = 0;

    for (const msg of messages) {
      const text = msg.content || msg.text || "";
      if (positivePatterns.test(text)) positive++;
      if (negativePatterns.test(text)) negative++;
    }

    if (positive > negative) return "positive";
    if (negative > positive) return "negative";
    return "neutral";
  }

  extractKeyPoints(messages) {
    const keyPoints = [];

    for (const msg of messages) {
      const text = msg.content || msg.text || "";

      if (/http.*github\.com/.test(text)) {
        const match = text.match(/https?:\/\/github\.com\/[^\s]+/);
        if (match) {
          keyPoints.push({ type: "reference", content: match[0] });
        }
      }

      if (/v\d+\.\d+/.test(text)) {
        const match = text.match(/v\d+\.\d+\.\d+/);
        if (match) {
          keyPoints.push({ type: "version", content: match[0] });
        }
      }
    }

    return keyPoints;
  }

  extractActionItems(messages) {
    const actionItems = [];
    const actionPatterns = [
      /請.*做/,
      /需要.*实现/,
      /要.*完成/,
      /記得.*更新/,
      /不要忘記/,
      /記住/,
    ];

    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];
      const text = msg.content || msg.text || "";

      for (const pattern of actionPatterns) {
        if (pattern.test(text)) {
          actionItems.push({
            content: text.substring(0, 100),
            source: msg.role || "unknown",
            index: i,
          });
          break;
        }
      }
    }

    return actionItems;
  }

  updateTracking(summary) {
    this.keyPoints.push(...summary.keyPoints);
    this.actionItems.push(...summary.actionItems);
  }

  getRecentSummaries(limit = 10) {
    return Array.from(this.summaries.values())
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
  }

  getActionItems() {
    return this.actionItems.slice(-20);
  }

  getTopics() {
    return Array.from(
      new Set(Array.from(this.summaries.values()).flatMap((s) => s.topics)),
    );
  }

  getStats() {
    return {
      summaryCount: this.summaries.size,
      actionItemCount: this.actionItems.length,
      topicCount: this.getTopics().length,
    };
  }
}

export const conversationSummarizer = new ConversationSummarizer();
