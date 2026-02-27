import { analyzeIntent } from "./lib/intent-understanding.js";
import { dispatchAgent } from "./lib/agent-dispatch.js";
import { generateContent } from "./lib/content-generation.js";
import { createSkillEngine } from "../skills/index.js";
import { createContext } from "../skills/matcher.js";
import { learning } from "../memory/learning.js";

let skillEngine = null;

export class TaonixAI {
  constructor() {
    this.name = "TaonixAI";
  }

  async init() {
    if (!skillEngine) {
      skillEngine = await createSkillEngine();
    }
    return this;
  }

  async process(input) {
    const intent = await analyzeIntent(input);
    const agents = await dispatchAgent(intent);

    const skillContext = createContext(input, {
      intent: { type: intent.intent },
      agents: agents.all,
    });

    let skillResult = null;
    const matchedSkill = await skillEngine.findSkill(skillContext);

    if (matchedSkill) {
      skillResult = await skillEngine.execute(matchedSkill.name, skillContext);

      await learning.learn({
        input,
        skill: matchedSkill.name,
        agents: agents.all,
        result: skillResult,
      });
    }

    const result = await generateContent(intent, agents);

    return {
      ...result,
      skill: skillResult ? matchedSkill.name : null,
      skillGuidance: skillResult,
      agents: agents.all,
    };
  }
}

export async function run(input) {
  const ai = new TaonixAI();
  await ai.init();
  return await ai.process(input);
}

export async function getSkills() {
  if (!skillEngine) {
    skillEngine = await createSkillEngine();
  }
  return skillEngine.getSkills();
}

export async function getLearningStats() {
  return learning.getPreferences();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const input = process.argv[2] || "帮我看看最近 python 有什么好玩的";
  console.log("輸入:", input);
  const result = await run(input);
  console.log("結果:", JSON.stringify(result, null, 2));
}
