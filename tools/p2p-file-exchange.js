import crypto from "crypto";
import fs from "fs";

/**
 * Taonix P2P File Exchange (v13.0.0)
 * 負責確保跨節點傳輸檔案的完整性與加密驗證。
 */
export const fileExchange = {
  /**
   * 生成檔案雜湊
   */
  generateHash(filePath) {
    const buffer = fs.readFileSync(filePath);
    return crypto.createHash("sha256").update(buffer).digest("hex");
  },

  /**
   * 驗證接收到的檔案
   */
  verify(filePath, expectedHash) {
    const actualHash = this.generateHash(filePath);
    return actualHash === expectedHash;
  },

  /**
   * 加密檔案 (示意)
   */
  encrypt(data, key) {
    const cipher = crypto.createCipher("aes-256-cbc", key);
    return Buffer.concat([cipher.update(data), cipher.final()]);
  }
};
