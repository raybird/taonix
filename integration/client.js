import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

export class TaonixMCPClient {
  constructor() {
    this.client = null;
    this.transport = null;
  }

  async connect(mcpServerPath = "./mcp-server/index.js") {
    this.transport = new StdioClientTransport({
      command: "node",
      args: [mcpServerPath],
    });

    this.client = new Client(
      { name: "taonix-client", version: "1.0.0" },
      { capabilities: {} },
    );

    await this.client.connect(this.transport);
    return this;
  }

  async listTools() {
    const response = await this.client.request({ method: "tools/list" }, {});
    return response.tools;
  }

  async callTool(toolName, args) {
    const response = await this.client.request(
      { method: "tools/call" },
      { name: toolName, arguments: args },
    );
    return response.content;
  }

  async disconnect() {
    if (this.client) {
      await this.client.close();
    }
  }
}

export async function createClient(mcpServerPath) {
  const client = new TaonixMCPClient();
  await client.connect(mcpServerPath);
  return client;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log("Taonix MCP Client - 測試連接");
  console.log('用法: import { createClient } from "./client.js"');
}
