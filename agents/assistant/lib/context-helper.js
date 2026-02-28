export class ContextManager {
  constructor(options = {}) {
    this.maxTokens = options.maxTokens || 100000;
    this.compressionThreshold = options.compressionThreshold || 0.8;
    this.contexts = new Map();
    this.cache = new Map();
  }

  createContext(id, initialContent = "") {
    const context = {
      id,
      content: initialContent,
      tokens: this.estimateTokens(initialContent),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      degradationScore: 0,
      history: [],
    };
    this.contexts.set(id, context);
    return context;
  }

  addToContext(id, newContent) {
    const ctx = this.contexts.get(id);
    if (!ctx) return this.createContext(id, newContent);

    ctx.history.push({ content: ctx.content, tokens: ctx.tokens });
    ctx.content += "\n" + newContent;
    ctx.tokens = this.estimateTokens(ctx.content);
    ctx.updatedAt = new Date().toISOString();
    ctx.degradationScore = this.calculateDegradation(ctx);

    return ctx;
  }

  estimateTokens(text) {
    return Math.ceil(text.length / 4);
  }

  calculateDegradation(ctx) {
    const ratio = ctx.tokens / this.maxTokens;
    if (ratio < 0.3) return 0;
    if (ratio < 0.6) return 0.3;
    if (ratio < 0.8) return 0.6;
    return 0.9;
  }

  compressContext(id, strategy = "summary") {
    const ctx = this.contexts.get(id);
    if (!ctx) return null;

    if (strategy === "summary") {
      const lines = ctx.content.split("\n");
      const summary = lines.slice(-20).join("\n");
      ctx.content = `[壓縮摘要] ${summary}`;
      ctx.tokens = this.estimateTokens(ctx.content);
      ctx.history = [];
    } else if (strategy === "mask") {
      ctx.content = "[上下文已遮罩]";
      ctx.tokens = 10;
    }

    ctx.updatedAt = new Date().toISOString();
    ctx.degradationScore = 0;
    return ctx;
  }

  getContextStatus(id) {
    const ctx = this.contexts.get(id);
    if (!ctx) return null;

    return {
      id: ctx.id,
      tokens: ctx.tokens,
      maxTokens: this.maxTokens,
      degradationScore: ctx.degradationScore,
      status: ctx.degradationScore < 0.3 ? "healthy" : "degraded",
      needsCompression: ctx.tokens > this.maxTokens * this.compressionThreshold,
    };
  }

  cacheContext(id, ttl = 3600000) {
    const ctx = this.contexts.get(id);
    if (!ctx) return false;

    this.cache.set(id, {
      context: ctx,
      expiresAt: Date.now() + ttl,
    });
    return true;
  }

  getCachedContext(id) {
    const cached = this.cache.get(id);
    if (!cached) return null;
    if (Date.now() > cached.expiresAt) {
      this.cache.delete(id);
      return null;
    }
    return cached.context;
  }
}

export async function analyzeContext(content) {
  const tokens = Math.ceil(content.length / 4);
  const hasLostInMiddle = content.length > 5000;

  return {
    tokens,
    wordCount: content.split(/\s+/).length,
    hasLostInMiddle,
    recommendation: tokens > 80000 ? "compress" : "ok",
  };
}

export async function compactContext(content, keepRecent = true) {
  const lines = content.split("\n");
  if (keepRecent) {
    const recent = lines.slice(-50).join("\n");
    return `[已壓縮] 保留最近 ${lines.length > 50 ? 50 : lines.length} 行\n\n${recent}`;
  }
  return content.substring(0, content.length / 2);
}
