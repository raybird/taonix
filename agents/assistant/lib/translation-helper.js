export async function translateText(
  text,
  targetLang = "en",
  sourceLang = "auto",
) {
  const langCodes = {
    en: "English",
    zh: "中文",
    ja: "日本語",
    ko: "한국어",
    es: "Español",
    fr: "Français",
    de: "Deutsch",
  };

  return {
    original: text,
    translated: text,
    sourceLang: sourceLang === "auto" ? "detected" : sourceLang,
    targetLang,
    targetLangName: langCodes[targetLang] || targetLang,
    timestamp: new Date().toISOString(),
  };
}

export async function detectLanguage(text) {
  const patterns = {
    zh: /[\u4e00-\u9fff]/,
    ja: /[\u3040-\u309f\u30a0-\u30ff]/,
    ko: /[\uac00-\ud7af]/,
    ar: /[\u0600-\u06ff]/,
    ru: /[\u0400-\u04ff]/,
  };

  for (const [lang, pattern] of Object.entries(patterns)) {
    if (pattern.test(text)) {
      return { language: lang, confidence: 0.9 };
    }
  }

  return { language: "en", confidence: 0.5 };
}

export async function batchTranslate(texts, targetLang = "en") {
  const results = await Promise.all(
    texts.map(async (text) => await translateText(text, targetLang)),
  );

  return {
    results,
    count: results.length,
    targetLang,
  };
}
