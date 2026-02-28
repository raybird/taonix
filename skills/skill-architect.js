import { AICaller } from "../ai-engine/lib/ai-caller.js";
import { skillSandbox } from "./sandbox.js";
import { RemoteSkillLoader } from "./remote-loader.js";
import { blackboard } from "../memory/blackboard.js";

/**
 * Taonix Skill Architect (v8.0.0)
 * 負責根據需求自動設計、編寫、驗證與安裝新技能。
 * v8.0.1 新增：自動循環驗證與修復機制。
 */
export class SkillArchitect {
  constructor() {
    this.aiCaller = new AICaller();
    this.loader = new RemoteSkillLoader();
  }

  /**
   * 根據需求生成新技能
   * @param {string} prompt 技能需求描述
   */
  async draftSkill(prompt) {
    console.log("[SkillArchitect] 正在設計新技能: " + prompt.substring(0, 30) + "...");
    blackboard.recordThought("skill-architect", "開始為新需求設計技能方案：" + prompt);

    const systemPrompt = `你是一個高級 AI 技能建築師。
請根據使用者需求返回 JSON 格式的完整技能包：
{
  "name": "技能名稱 (kebab-case)",
  "description": "描述",
  "skillMd": "符合 agentskills.io 規範的 Markdown",
  "mainJs": "符合規範的 ESM 程式碼，必須匯出具備 execute(ctx) 方法的物件"
}`;

    let retryCount = 0;
    let draft = null;

    while (retryCount < 3) {
      try {
        const response = await this.aiCaller.call("需求: " + prompt + (retryCount > 0 ? "\n請修正先前的錯誤。" : ""), { systemPrompt });
        draft = JSON.parse(response.content);

        console.log("[SkillArchitect] 正在進行沙盒驗證 (嘗試 " + (retryCount + 1) + ")...");
        
        // 執行驗證
        await skillSandbox.run(draft.mainJs, { dryRun: true }, { skillName: draft.name });

        // 通過驗證，執行安裝
        await this.loader.install(draft.name, {
          skillMd: draft.skillMd,
          mainJs: draft.mainJs
        });

        blackboard.recordThought("skill-architect", "新技能 「" + draft.name + "」 已成功生成並通過驗證。");
        return { success: true, name: draft.name };

      } catch (e) {
        retryCount++;
        console.warn("[SkillArchitect] 驗證失敗，正在嘗試修復... 錯誤: " + e.message);
        blackboard.recordThought("skill-architect", "技能驗證失敗 (嘗試 " + retryCount + ")，準備重新修復。");
      }
    }

    throw new Error("技能生成在多次嘗試後依然失敗。");
  }
}
export const skillArchitect = new SkillArchitect();
