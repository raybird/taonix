#!/usr/bin/env node

/**
 * AICaller (v26.0.0)
 * 支援 opencode / gemini / codex / ollama 四種 CLI provider。
 * 支援 setSystemPrompt() 供 BaseAgent 設定角色提示詞。
 */
export class AICaller {
  constructor(options = {}) {
    this.provider = options.provider || process.env.TAONIX_AI_PROVIDER || "opencode";
    this.model = options.model || process.env.TAONIX_AI_MODEL || null;
    this.cliArgs = options.cliArgs || [];
    this.systemPrompt = "You are a helpful assistant.";
  }

  setSystemPrompt(prompt) {
    this.systemPrompt = prompt;
  }

  async call(prompt, options = {}) {
    const {
      systemPrompt = this.systemPrompt,
      temperature = 0.7,
      provider = this.provider,
      model = this.model,
      cliArgs = this.cliArgs,
    } = options;

    const fullPrompt = `[系統指令]\n${systemPrompt}\n\n[使用者請求]\n${prompt}`;

    try {
      const { execFileSync } = await import("child_process");
      const { command, args } = this.buildCommand(provider, model, prompt, fullPrompt, systemPrompt, cliArgs);
      const result = execFileSync(command, args, {
        encoding: "utf-8",
        timeout: 600_000,
        maxBuffer: 10 * 1024 * 1024,
      });
      return this.parseResponse(result, provider, model);
    } catch (error) {
      return { error: error.message, provider, model };
    }
  }

  buildCommand(provider, model, prompt, fullPrompt, systemPrompt, cliArgs = []) {
    switch (provider) {
      case "opencode": {
        const args = ["run", ...cliArgs, fullPrompt];
        if (model) args.push("-m", model);
        args.push("--format", "default");
        return { command: "opencode", args };
      }
      case "gemini": {
        const args = this.buildGeminiArgs(cliArgs, model, fullPrompt);
        return { command: "gemini", args };
      }
      case "codex": {
        const args = ["exec", ...cliArgs];
        if (model) args.push("-m", model);
        args.push(fullPrompt);
        return { command: "codex", args };
      }
      case "ollama": {
        if (!model) {
          throw new Error("Ollama provider requires a model.");
        }
        return {
          command: "ollama",
          args: ["run", model, ...cliArgs, prompt, "--system", systemPrompt],
        };
      }
      default:
        throw new Error(`Unsupported AI provider: ${provider}`);
    }
  }

  buildGeminiArgs(cliArgs = [], model, fullPrompt) {
    const args = [...cliArgs];
    if (model) args.push("-m", model);

    const promptFlags = ["-p", "--prompt", "-i", "--prompt-interactive"];
    const promptFlagIndex = args.findIndex((arg) => promptFlags.includes(arg));

    // Gemini 官方建議使用 positional prompt；若呼叫端明確傳 prompt flag，則補值到該 flag 後面。
    if (promptFlagIndex !== -1) {
      args.splice(promptFlagIndex + 1, 0, fullPrompt);
      return args;
    }

    args.push(fullPrompt);
    return args;
  }

  parseResponse(response, provider = this.provider, model = this.model) {
    const content = (response || "").trim();
    // 嘗試 JSON parse（相容舊格式）
    try {
      const data = JSON.parse(content);
      if (data.choices && data.choices[0]) {
        return {
          content: data.choices[0].message?.content || data.choices[0].text,
          model,
          provider,
        };
      }
    } catch {
      // CLI 預設多為純文字，直接使用
    }
    return { content, model, provider };
  }
}
