export async function matchSkill(context, skills) {
  const { input, intent = {}, agents = [] } = context;
  const text = (input || "").toLowerCase();

  const scores = [];

  for (const [name, skill] of skills) {
    let score = 0;

    if (skill.triggers) {
      for (const trigger of skill.triggers) {
        if (text.includes(trigger.toLowerCase())) {
          score += 10;
        }
      }
    }

    if (skill.intentTypes) {
      if (skill.intentTypes.includes(intent.type)) {
        score += 5;
      }
    }

    if (skill.requiredAgents) {
      const hasRequired = skill.requiredAgents.every((a) =>
        agents.some((ag) => ag.agent === a),
      );
      if (hasRequired) {
        score += 3;
      }
    }

    if (skill.keywords) {
      for (const kw of skill.keywords) {
        if (text.includes(kw.toLowerCase())) {
          score += 2;
        }
      }
    }

    if (score > 0) {
      scores.push({ name, score, skill });
    }
  }

  scores.sort((a, b) => b.score - a.score);

  return scores.length > 0 ? scores[0] : null;
}

export function createContext(input, options = {}) {
  return {
    input,
    intent: options.intent || {},
    agents: options.agents || [],
    project: options.project || null,
    user: options.user || null,
  };
}
