const translations = {
  en: {
    greeting: "Hello!",
    welcome: "Welcome to Taonix",
    agents: "Agents",
    explorer: "Explorer",
    coder: "Coder",
    oracle: "Oracle",
    reviewer: "Reviewer",
    designer: "Designer",
    product: "Product",
    tester: "Tester",
    status: "Status",
    ready: "Ready",
    running: "Running",
    completed: "Completed",
    failed: "Failed",
    skills: "Skills",
    marketplace: "Marketplace",
    planning: "Planning",
    suggestion: "Suggestion",
    partyMode: "Party Mode",
    dashboard: "Dashboard",
  },
  zh: {
    greeting: "你好！",
    welcome: "歡迎使用 Taonix",
    agents: "代理",
    explorer: "探索者",
    coder: "工程師",
    oracle: "分析師",
    reviewer: "審查者",
    designer: "設計師",
    product: "產品經理",
    tester: "測試工程師",
    status: "狀態",
    ready: "就緒",
    running: "執行中",
    completed: "已完成",
    failed: "失敗",
    skills: "技能",
    marketplace: "技能市場",
    planning: "規劃",
    suggestion: "建議",
    partyMode: "派對模式",
    dashboard: "儀表板",
  },
  ja: {
    greeting: "こんにちは！",
    welcome: "Taonixへようこそ",
    agents: "エージェント",
    explorer: "エクスプローラー",
    coder: "コーダー",
    oracle: "オラクル",
    reviewer: "レビュアー",
    designer: "デザイナー",
    product: "プロダクト",
    tester: "テスター",
    status: "ステータス",
    ready: "準備完了",
    running: "実行中",
    completed: "完了",
    failed: "失敗",
    skills: "スキル",
    marketplace: "マーケットプレイス",
    planning: "プランニング",
    suggestion: "提案",
    partyMode: "パーティーモード",
    dashboard: "ダッシュボード",
  },
};

class I18n {
  constructor(defaultLocale = "zh") {
    this.locale = defaultLocale;
    this.translations = translations;
  }

  setLocale(locale) {
    if (this.translations[locale]) {
      this.locale = locale;
      return { success: true, locale };
    }
    return { success: false, error: "Locale not supported" };
  }

  getLocale() {
    return this.locale;
  }

  t(key) {
    const localeData = this.translations[this.locale];
    return localeData[key] || this.translations["en"][key] || key;
  }

  getAvailableLocales() {
    return Object.keys(this.translations);
  }

  addTranslation(locale, translations) {
    if (!this.translations[locale]) {
      this.translations[locale] = {};
    }
    Object.assign(this.translations[locale], translations);
    return { success: true, locale };
  }
}

export const i18n = new I18n();
export default i18n;
