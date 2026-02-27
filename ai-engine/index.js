import { analyzeIntent } from "./lib/intent-understanding.js";
import { dispatchAgent } from "./lib/agent-dispatch.js";
import { generateContent } from "./lib/content-generation.js";

export class TaonixAI {
  constructor() {
    this.name = "TaonixAI";
  }

  async process(input) {
    const intent = await analyzeIntent(input);

    const agents = await dispatchAgent(intent);

    const result = await generateContent(intent, agents);

    return result;
  }
}

export async function run(input) {
  const ai = new TaonixAI();
  return await ai.process(input);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const input = process.argv[2] || "帮我看看最近 python 有什么好玩的";
  console.log("輸入:", input);
  const result = await run(input);
  console.log("結果:", JSON.stringify(result, null, 2));
}
