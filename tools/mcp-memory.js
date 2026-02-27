export const mcp_memory_libsql_create_entities = async ({ entities }) => {
  console.log(
    "[MCP Memory] create_entities called with",
    entities?.length,
    "entities",
  );
  return { success: true, entities };
};

export const mcp_memory_libsql_search_nodes = async ({ query, limit = 10 }) => {
  console.log("[MCP Memory] search_nodes called with query:", query);
  return { results: [], message: "MCP Memory search not implemented" };
};

export const mcp_memory_libsql_create_relations = async ({ relations }) => {
  console.log(
    "[MCP Memory] create_relations called with",
    relations?.length,
    "relations",
  );
  return { success: true, relations };
};

export const mcp_memory_libsql_read_graph = async () => {
  console.log("[MCP Memory] read_graph called");
  return { entities: [], relations: [] };
};

export const mcp_memory_libsql_delete_entity = async ({ name }) => {
  console.log("[MCP Memory] delete_entity called for:", name);
  return { success: true };
};

export const mcp_memory_libsql_delete_relation = async ({
  source,
  target,
  type,
}) => {
  console.log("[MCP Memory] delete_relation called:", source, "->", target);
  return { success: true };
};
