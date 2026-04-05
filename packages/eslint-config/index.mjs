import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import vue from 'eslint-plugin-vue';

export function createConfig() {
  const typedFiles = ['**/*.{ts,tsx,vue,mts,cts}'];

  return tseslint.config(
    {
      ignores: [
        '**/dist/**',
        '**/coverage/**',
        '**/storybook-static/**',
        '**/site-dist/**',
        '**/.idea/**',
        'vitest.config.ts',
        'vite.aliases.ts',
        'vite.chunking.ts',
      ],
    },
    js.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked.map((config) => ({
      ...config,
      files: typedFiles,
    })),
    ...vue.configs['flat/recommended'],
    {
      files: typedFiles,
      languageOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        globals: {
          ...globals.browser,
          ...globals.node,
        },
        parserOptions: {
          parser: tseslint.parser,
          projectService: true,
          extraFileExtensions: ['.vue'],
        },
      },
      rules: {
        '@typescript-eslint/consistent-type-imports': 'error',
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/no-floating-promises': 'error',
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            argsIgnorePattern: '^_',
            varsIgnorePattern: '^_',
          },
        ],
        'vue/attribute-hyphenation': 'off',
        'vue/html-self-closing': 'off',
        'vue/max-attributes-per-line': 'off',
        'vue/multi-word-component-names': 'off',
        'vue/one-component-per-file': 'off',
        'vue/require-default-prop': 'off',
        'vue/require-explicit-emits': 'error',
        'vue/singleline-html-element-content-newline': 'off',
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: ['@ww/*/src/**'],
                message: 'Import from package roots instead of package source internals.',
              },
              {
                group: [
                  '@ww/*/dist',
                  '@ww/*/dist/**',
                  '**/packages/*/dist/**',
                  '**/packages/third-party/*/dist/**',
                ],
                message:
                  'Workspace apps and source files must not import workspace dist artifacts.',
              },
            ],
            paths: [
              {
                name: '@ww/primitives/motion',
                message: 'Import from @ww/primitives instead of non-exported motion subpaths.',
              },
              {
                name: '@ww/primitives/overlay',
                message: 'Import from @ww/primitives instead of non-exported overlay subpaths.',
              },
            ],
          },
        ],
      },
    },
    {
      files: ['packages/core/src/**/*.{ts,vue}'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            paths: [
              {
                name: '@ww/charts-apex',
                message: '@ww/core must not import vendor-backed adapters.',
              },
              { name: '@ww/signal-graph', message: '@ww/core must not import systems packages.' },
              { name: '@ww/widgets', message: '@ww/core must not import widgets.' },
              { name: '@ww/page-templates', message: '@ww/core must not import page templates.' },
              { name: '@ww/docs', message: '@ww/core must not import apps.' },
              { name: '@ww/playground', message: '@ww/core must not import apps.' },
            ],
          },
        ],
      },
    },
    {
      files: ['packages/widgets/src/**/*.{ts,vue}'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            paths: [
              { name: '@ww/docs', message: '@ww/widgets must not import apps.' },
              { name: '@ww/playground', message: '@ww/widgets must not import apps.' },
            ],
          },
        ],
      },
    },
    {
      files: ['packages/page-templates/src/**/*.{ts,vue}'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            paths: [
              { name: '@ww/docs', message: '@ww/page-templates must not import apps.' },
              { name: '@ww/playground', message: '@ww/page-templates must not import apps.' },
            ],
          },
        ],
      },
    },
    {
      files: ['scripts/**/*.{js,mjs,cjs}', 'tools/**/*.{js,mjs,cjs}'],
      languageOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        globals: {
          ...globals.node,
        },
      },
    },
    {
      files: [
        '**/*.{stories,test,spec}.{ts,tsx}',
        'tests/**/*.{ts,mts,cts}',
        'tests/**/*.{js,mjs,cjs}',
        'vitest.config.ts',
      ],
      ...tseslint.configs.disableTypeChecked,
      languageOptions: {
        ...tseslint.configs.disableTypeChecked.languageOptions,
        globals: {
          ...globals.browser,
          ...globals.node,
        },
        parserOptions: {
          ...tseslint.configs.disableTypeChecked.languageOptions?.parserOptions,
          parser: tseslint.parser,
          extraFileExtensions: ['.vue'],
        },
      },
      rules: {
        ...tseslint.configs.disableTypeChecked.rules,
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        'no-undef': 'off',
      },
    },
    {
      files: ['tests/**/*.config.ts'],
      ...tseslint.configs.disableTypeChecked,
      languageOptions: {
        ...tseslint.configs.disableTypeChecked.languageOptions,
        globals: {
          ...globals.node,
        },
        parserOptions: {
          ...tseslint.configs.disableTypeChecked.languageOptions?.parserOptions,
          parser: tseslint.parser,
        },
      },
      rules: {
        ...tseslint.configs.disableTypeChecked.rules,
        'no-undef': 'off',
      },
    },
    {
      files: ['apps/docs/.storybook/**/*.ts', '**/vite.config.ts', '**/vitest.config.ts'],
      ...tseslint.configs.disableTypeChecked,
      languageOptions: {
        ...tseslint.configs.disableTypeChecked.languageOptions,
        globals: {
          ...globals.browser,
          ...globals.node,
        },
        parserOptions: {
          ...tseslint.configs.disableTypeChecked.languageOptions?.parserOptions,
          parser: tseslint.parser,
        },
      },
      rules: {
        ...tseslint.configs.disableTypeChecked.rules,
        'no-undef': 'off',
      },
    },
    eslintConfigPrettier
  );
}
