#!/usr/bin/env node

/**
 * AICaller (v24.0.0)
 * 預設使用 opencode run 作為 AI 呼叫方式，保留 ollama 作為備用。
 * 支援 setSystemPrompt() 供 BaseAgent 設定角色提示詞。
 */
export class AICaller {
  constructor(options = {}) {
    this.provider = options.provider || "opencode";
    this.model = options.model || null; // opencode 使用其自身設定的預設 model
    this.systemPrompt = "You are a helpful assistant.";
  }

  setSystemPrompt(prompt) {
    this.systemPrompt = prompt;
  }

  async call(prompt, options = {}) {
    const { systemPrompt = this.systemPrompt, temperature = 0.7 } = options;

    const fullPrompt = `[系統指令]\n${systemPrompt}\n\n[使用者請求]\n${prompt}`;

    let cmd;
    if (this.provider === "opencode") {
      const escaped = fullPrompt.replace(/'/g, "'\\''");
      const modelFlag = this.model ? ` -m "${this.model}"` : "";
      cmd = `opencode run '${escaped}'${modelFlag} --format default`;
    } else if (this.provider === "ollama") {
      const escapedPrompt = prompt.replace(/"/g, '\\"');
      const escapedSystem = systemPrompt.replace(/"/g, '\\"');
      cmd = `ollama run ${this.model} "${escapedPrompt}" --system "${escapedSystem}"`;
    }

    try {
      const { execSync } = await import("child_process");
      const result = execSync(cmd, {
        encoding: "utf-8",
        timeout: 600_000,
        maxBuffer: 10 * 1024 * 1024,
      });
      return this.parseResponse(result);
    } catch (error) {
      return { error: error.message, provider: this.provider };
    }
  }

  parseResponse(response) {
    const content = (response || "").trim();
    // 嘗試 JSON parse（相容舊格式）
    try {
      const data = JSON.parse(content);
      if (data.choices && data.choices[0]) {
        return {
          content: data.choices[0].message?.content || data.choices[0].text,
          model: this.model,
          provider: this.provider,
        };
      }
    } catch {
      // opencode default 格式為純文字，直接使用
    }
    return { content, model: this.model, provider: this.provider };
  }
}
