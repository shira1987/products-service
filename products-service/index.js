import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod'; // for schema validation

// Improve robustness: log and handle uncaught errors so the server
// doesn't crash unexpectedly.
process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection at:', p, 'reason:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

/* 1 - Initialization */
const server = new McpServer({
  name: 'products Service',
  version: '1.0.0',
});

server.tool(
  'getProducts',
  'Get all products from Fake Store API',
  {},
  async () => {
    try {
      const response = await fetch('https://fakestoreapi.com/products');
      const products = await response.json();

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(products, null, 2),
          },
        ],
      };
    } catch (err) {
      // Log and return an empty list text so callers receive a valid result
      // instead of the server crashing.
      console.error('getProducts tool failed:', err?.stack ?? err);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify([], null, 2),
          },
        ],
      };
    }
  },
);

/* 4 - Transport */
// Start STDIO transport (best for local dev)
/* 4 - Transport */
// Start STDIO transport (best for local dev)
const transport = new StdioServerTransport();
try {
  await server.connect(transport);
} catch (err) {
  console.error('Failed to start MCP server:', err?.stack ?? err);
  // Exit with non-zero so orchestration systems know start failed.
  process.exit(1);
}

// // Using console.error to avoid interfering with stdio communication
// console.error('Weather MCP Server running on stdio');
