import { createRuntime } from "../../core/runtime/index.js";

export async function createMcpHub() {
  const runtime = await createRuntime();

  return {
    tools: [
      {
        name: "taonix_hub",
        description: "Stable Taonix MCP hub tool.",
        inputSchema: {
          type: "object",
          properties: {
            intent: { type: "string" },
            task: { type: "object" },
          },
        },
      },
    ],
    async callTool(name, args = {}) {
      if (name !== "taonix_hub") {
        throw new Error("Unknown tool");
      }

      if (args.task) {
        return runtime.runTask(args.task);
      }

      return runtime.run(args.intent || "");
    },
    async startStdioServer() {
      const [{ Server }, { StdioServerTransport }, schemas] = await Promise.all([
        import("@modelcontextprotocol/sdk/server/index.js"),
        import("@modelcontextprotocol/sdk/server/stdio.js"),
        import("@modelcontextprotocol/sdk/types.js"),
      ]);
      const { CallToolRequestSchema, ListToolsRequestSchema } = schemas;
      const server = new Server(
        { name: "taonix-hub", version: "27.0.0" },
        { capabilities: { tools: {} } },
      );

      server.setRequestHandler(ListToolsRequestSchema, async () => ({
        tools: this.tools,
      }));
      server.setRequestHandler(CallToolRequestSchema, async (request) => {
        const response = await this.callTool(request.params.name, request.params.arguments);
        return {
          content: [{ type: "text", text: JSON.stringify(response, null, 2) }],
        };
      });

      const transport = new StdioServerTransport();
      await server.connect(transport);
      return server;
    },
  };
}
