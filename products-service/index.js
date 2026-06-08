import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod'; // for schema validation
import { fetchProducts } from './lib.js';

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
    const products = await fetchProducts();
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(products, null, 2),
        },
      ],
    };
  },
);

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
