import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fetchProducts } from '../lib.js';

test('fetchProducts returns an array', async () => {
  const products = await fetchProducts();
  assert.ok(Array.isArray(products));
});

test('fetchProducts returns empty array on fetch failure', async () => {
  const originalFetch = global.fetch;
  try {
    global.fetch = async () => { throw new Error('network'); };
    const products = await fetchProducts();
    assert.deepEqual(products, []);
  } finally {
    global.fetch = originalFetch;
  }
});
