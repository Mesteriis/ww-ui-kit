import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    vue(),
    dts({
      exclude: ['src/**/*.test.ts'],
      entryRoot: 'src',
      tsconfigPath: './tsconfig.build.json',
    }),
  ],
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: [
        'vue',
        '@vue-flow/background',
        '@vue-flow/controls',
        '@vue-flow/core',
        '@vue-flow/minimap',
        '@ww/core',
        '@ww/primitives',
        '@ww/themes',
      ],
    },
  },
});
