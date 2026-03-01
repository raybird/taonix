#!/usr/bin/env node

/**
 * AICaller (v13.1.0)
 * 修復 Risk B: 支援 systemPrompt，確保語義路由與技能生成的精準度。
 */
export class AICaller {
  constructor(options = {}) {
    this.provider = options.provider || "openai";
    this.model = options.model || "gpt-4";
    this.baseUrl = options.baseUrl || null;
  }

  async call(prompt, options = {}) {
    const { systemPrompt = "You are a helpful assistant.", temperature = 0.7 } = options;

    let cmd;
    // 將 systemPrompt 整合進 messages 數組
    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt }
    ];

    if (this.provider === "openai") {
      const escapedMessages = JSON.stringify(messages).replace(/'/g, "'\\''");
      cmd = `echo '${escapedMessages}' | npx -y openai@latest chat.completions.create --model ${this.model} --stream false`;
    } else if (this.provider === "ollama") {
      // Ollama 支援 --system 參數
      const escapedPrompt = prompt.replace(/"/g, '\\"');
      const escapedSystem = systemPrompt.replace(/"/g, '\\"');
      cmd = `ollama run ${this.model} "${escapedPrompt}" --system "${escapedSystem}"`;
    } else {
      // Fallback
      const escapedMessages = JSON.stringify(messages).replace(/'/g, "'\\''");
      cmd = `echo '${escapedMessages}' | npx -y openai@latest chat.completions.create --model ${this.model}`;
    }

    try {
      const { execSync } = await import("child_process");
      const result = execSync(cmd, {
        encoding: "utf-8",
        timeout: 60000,
        maxBuffer: 10 * 1024 * 1024,
      });
      return this.parseResponse(result);
    } catch (error) {
      return { error: error.message, provider: this.provider };
    }
  }

  parseResponse(response) {
    try {
      const data = JSON.parse(response);
      if (data.choices && data.choices[0]) {
        return {
          content: data.choices[0].message?.content || data.choices[0].text,
          model: this.model,
          provider: this.provider,
        };
      }
      return { content: response, model: this.model, provider: this.provider };
    } catch {
      return { content: response, model: this.model, provider: this.provider };
    }
  }
}
