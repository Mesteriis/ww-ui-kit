import js from '@eslint/js';
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
        'vitest.workspace.ts',
        'vite.aliases.ts',
        '**/vite.config.ts',
        '**/vitest.config.ts'
      ]
    },
    js.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked.map((config) => ({
      ...config,
      files: typedFiles
    })),
    ...vue.configs['flat/recommended'],
    {
      files: typedFiles,
      languageOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        globals: {
          ...globals.browser,
          ...globals.node
        },
        parserOptions: {
          parser: tseslint.parser,
          projectService: true,
          extraFileExtensions: ['.vue']
        }
      },
      rules: {
        '@typescript-eslint/consistent-type-imports': 'error',
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/no-floating-promises': 'error',
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            argsIgnorePattern: '^_',
            varsIgnorePattern: '^_'
          }
        ],
        'vue/attribute-hyphenation': 'off',
        'vue/html-self-closing': 'off',
        'vue/max-attributes-per-line': 'off',
        'vue/multi-word-component-names': 'off',
        'vue/one-component-per-file': 'off',
        'vue/require-default-prop': 'off',
        'vue/require-explicit-emits': 'error',
        'vue/singleline-html-element-content-newline': 'off'
      }
    },
    {
      files: ['scripts/**/*.{js,mjs,cjs}'],
      languageOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        globals: {
          ...globals.node
        }
      }
    },
    {
      files: ['**/*.{stories,test,spec}.{ts,tsx}'],
      ...tseslint.configs.disableTypeChecked,
      languageOptions: {
        ...tseslint.configs.disableTypeChecked.languageOptions,
        parserOptions: {
          ...tseslint.configs.disableTypeChecked.languageOptions?.parserOptions,
          parser: tseslint.parser,
          extraFileExtensions: ['.vue']
        }
      },
      rules: {
        ...tseslint.configs.disableTypeChecked.rules,
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off'
      }
    }
  );
}
