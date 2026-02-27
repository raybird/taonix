class TaskSplitter {
  constructor() {
    this.maxChunkSize = 2000;
    this.minChunkSize = 500;
  }

  splitTask(task, options = {}) {
    const { maxChunks = 4, strategy = "auto" } = options;

    if (task.length <= this.maxChunkSize) {
      return [{ id: "chunk_1", content: task, index: 0, total: 1 }];
    }

    switch (strategy) {
      case "by_sentence":
        return this.splitBySentence(task, maxChunks);
      case "by_paragraph":
        return this.splitByParagraph(task, maxChunks);
      case "by_keyword":
        return this.splitByKeyword(task, maxChunks);
      default:
        return this.autoSplit(task, maxChunks);
    }
  }

  splitBySentence(task, maxChunks) {
    const sentences = task.match(/[^.!?]+[.!?]+/g) || [task];
    return this.distributeChunks(sentences, maxChunks);
  }

  splitByParagraph(task, maxChunks) {
    const paragraphs = task.split(/\n\n+/).filter((p) => p.trim());
    return this.distributeChunks(paragraphs, maxChunks);
  }

  splitByKeyword(task, maxChunks) {
    const keywords = this.extractKeywords(task);
    const chunks = [];
    let currentChunk = "";

    for (const keyword of keywords) {
      if (currentChunk.length + keyword.length > this.maxChunkSize) {
        if (currentChunk) {
          chunks.push(currentChunk.trim());
          currentChunk = "";
        }
      }
      currentChunk += " " + keyword;
    }

    if (currentChunk) {
      chunks.push(currentChunk.trim());
    }

    return chunks.map((content, index) => ({
      id: `chunk_${index + 1}`,
      content,
      index,
      total: chunks.length,
    }));
  }

  autoSplit(task, maxChunks) {
    const avgChunkSize = Math.ceil(task.length / maxChunks);
    const chunks = [];

    for (let i = 0; i < task.length; i += avgChunkSize) {
      chunks.push(task.slice(i, i + avgChunkSize));
    }

    return chunks.map((content, index) => ({
      id: `chunk_${index + 1}`,
      content,
      index,
      total: chunks.length,
    }));
  }

  distributeChunks(items, maxChunks) {
    const chunkSize = Math.ceil(items.length / maxChunks);
    const chunks = [];

    for (let i = 0; i < items.length; i += chunkSize) {
      chunks.push(items.slice(i, i + chunkSize).join(" "));
    }

    return chunks.map((content, index) => ({
      id: `chunk_${index + 1}`,
      content,
      index,
      total: chunks.length,
    }));
  }

  extractKeywords(text) {
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    const freq = {};
    for (const word of words) {
      if (word.length > 3) {
        freq[word] = (freq[word] || 0) + 1;
      }
    }
    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 50)
      .map(([word]) => word);
  }

  estimateComplexity(task) {
    const indicators = {
      files: (task.match(/\b(file|files|folder|directory)\b/gi) || []).length,
      code: (task.match(/\b(function|class|module|import|export)\b/gi) || [])
        .length,
      lines: (task.match(/\b(lines|line|thousand|千行)\b/gi) || []).length,
      multi: (task.match(/\band\b|\bas well as\b|\balso\b/gi) || []).length,
    };

    const score = Object.values(indicators).reduce((a, b) => a + b, 0);

    if (score >= 5) return { level: "high", chunks: 4 };
    if (score >= 3) return { level: "medium", chunks: 3 };
    return { level: "low", chunks: 2 };
  }
}

export const taskSplitter = new TaskSplitter();
export default taskSplitter;
