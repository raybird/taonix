import https from "https";
import { blackboard } from "../../memory/blackboard.js";
import { eventBus } from "./event-bus.js";

/**
 * Taonix API Connector (v7.0.0)
 * 負責統一處理外部 API 呼叫、狀態追蹤與結果注入。
 */
export class APIConnector {
  constructor() {
    this.registry = new Map(); // 儲存已配置的端點資訊
  }

  /**
   * 配置外部 API 端點
   */
  configureEndpoint(name, config) {
    this.registry.set(name, config);
    console.log(`[APIConnector] 已配置端點: ${name}`);
  }

  /**
   * 執行 API 呼叫
   * @param {string} endpointName 
   * @param {object} params 
   */
  async request(endpointName, params = {}) {
    const config = this.registry.get(endpointName);
    if (!config) throw new Error(`未找到端點配置: ${endpointName}`);

    console.log(`[APIConnector] 正在向 ${endpointName} 發送請求...`);
    blackboard.recordThought("api-connector", `發起外部 API 請求至 「${endpointName}」。`);

    try {
      // 簡單的實作 (實際環境應支援更多 method/headers)
      const response = await this._fetch(config.url, params);
      
      const result = {
        endpoint: endpointName,
        data: response,
        timestamp: new Date().toISOString()
      };

      // 1. 更新黑板事實
      blackboard.updateFact(`api_result_${endpointName}`, result, "api-connector");
      
      // 2. 發布事件
      eventBus.publish("EXTERNAL_DATA_RECEIVED", result, "api-connector");

      return result;
    } catch (e) {
      blackboard.recordThought("api-connector", `API 請求失敗: ${e.message}`);
      throw e;
    }
  }

  _fetch(url, params) {
    return new Promise((resolve, reject) => {
      // 此處僅為示意，實際應實作完整的 HTTP 請求邏輯
      setTimeout(() => resolve({ status: "mock_success", data: "API Response Data" }), 1000);
    });
  }
}

export const apiConnector = new APIConnector();
