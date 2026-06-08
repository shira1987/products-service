import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod'; // for schema validation

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
  },
);

// New tool requested in issue #2: return exactly 3 students with `id` and `name`.
server.tool(
  'getStudents',
  'Return exactly three students (id and name)',
  {},
  async () => {
    const students = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
      { id: 3, name: 'Carol' },
    ];

    return {
      content: [
        {
          type: 'json',
          json: students,
        },
      ],
    };
  },
);

/* 4 - Transport */
// Start STDIO transport (best for local dev)
const transport = new StdioServerTransport();
await server.connect(transport);
