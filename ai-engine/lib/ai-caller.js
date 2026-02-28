#!/usr/bin/env node

export class AICaller {
  constructor(options = {}) {
    this.provider = options.provider || "openai";
    this.model = options.model || "gpt-4";
    this.baseUrl = options.baseUrl || null;
    this.cliPath = this.getCLIPath();
  }

  getCLIPath() {
    switch (this.provider) {
      case "openai":
        return "npx";
      case "anthropic":
        return "npx";
      case "ollama":
        return "ollama";
      default:
        return "npx";
    }
  }

  buildCommand(prompt) {
    switch (this.provider) {
      case "openai":
        return [
          "npx",
          "-y",
          "openai@latest",
          "chat.completions.create",
          "--model",
          this.model,
          "--messages",
          JSON.stringify([{ role: "user", content: prompt }]),
        ];
      case "anthropic":
        return [
          "npx",
          "-y",
          "@anthropic-ai/claude-cli",
          "complete",
          "--model",
          this.model,
          "--prompt",
          prompt,
        ];
      case "ollama":
        return ["ollama", "chat", this.model, "--msg", prompt];
      default:
        return null;
    }
  }

  async call(prompt, options = {}) {
    const { temperature = 0.7, maxTokens = 2000 } = options;

    let cmd;
    if (this.provider === "openai") {
      cmd = `echo '${JSON.stringify([{ role: "user", content: prompt }])}' | npx -y openai@latest chat.completions.create --model ${this.model} --stream false`;
    } else if (this.provider === "ollama") {
      cmd = `ollama run ${this.model} "${prompt.replace(/"/g, '\\"')}"`;
    } else {
      cmd = `echo '${prompt}' | npx -y openai@latest chat.completions.create --model ${this.model}`;
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

  static detectAvailableProviders() {
    const providers = [];

    try {
      const { execSync } = require("child_process");
      execSync("ollama --version", { stdio: "ignore" });
      providers.push("ollama");
    } catch {}

    providers.push("openai");
    return providers;
  }
}

const args = process.argv.slice(2);

if (args.length > 0 && args[0] === "providers") {
  console.log(JSON.stringify(AICaller.detectAvailableProviders(), null, 2));
  process.exit(0);
}

if (args.length === 0) {
  console.log(`
Taonix AI Caller
================
用法:
  ai-caller --provider <openai|ollama|anthropic> --model <model> --prompt "<prompt>"
  
範例:
  ai-caller --provider openai --model gpt-4 --prompt "Hello"
  ai-caller --provider ollama --model llama2 --prompt "你好"
  
可用供應商:
  ${AICaller.detectAvailableProviders().join(", ")}
  `);
  process.exit(0);
}

const options = {};
let prompt = "";

for (let i = 0; i < args.length; i++) {
  if (args[i] === "--provider" && args[i + 1]) {
    options.provider = args[i + 1];
    i++;
  } else if (args[i] === "--model" && args[i + 1]) {
    options.model = args[i + 1];
    i++;
  } else if (args[i] === "--prompt" && args[i + 1]) {
    prompt = args.slice(i + 1).join(" ");
    break;
  }
}

if (!prompt) {
  console.error("錯誤: 請提供 --prompt");
  process.exit(1);
}

const caller = new AICaller(options);
const result = await caller.call(prompt);

console.log(JSON.stringify(result, null, 2));
