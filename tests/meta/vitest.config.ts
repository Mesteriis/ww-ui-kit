import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'meta',
    environment: 'node',
    include: ['tests/meta/**/*.test.ts'],
  },
});
