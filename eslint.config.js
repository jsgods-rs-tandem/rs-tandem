import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import angular from 'angular-eslint';
import unicorn from 'eslint-plugin-unicorn';
import unusedImports from 'eslint-plugin-unused-imports';
import prettierConfig from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  { linterOptions: { noInlineConfig: true } },
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/out-tsc/**',
      '**/.angular/**',
      '**/.cache/**',
      '**/tmp/**',
      'package-lock.json',
      'eslint.config.js',
      '.validate-branch-name.js',
    ],
  },

  {
    files: ['**/*.ts'],
    extends: [
      js.configs.recommended,
      importPlugin.flatConfigs.recommended,
      ...tseslint.configs.strictTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
        project: [
          './packages/frontend/tsconfig.app.json',
          './packages/frontend/tsconfig.spec.json',
          './packages/backend/tsconfig.json',
          './packages/shared/tsconfig.json',
        ],
      },
    },
    plugins: {
      'unused-imports': unusedImports,
      unicorn,
    },
    rules: {
      'unicorn/no-array-callback-reference': 'off',
      'unicorn/no-array-for-each': 'off',
      'unicorn/no-array-reduce': 'off',
      'unicorn/no-null': 'off',
      'unicorn/number-literal-case': 'off',
      'unicorn/numeric-separators-style': 'off',
      'unicorn/prevent-abbreviations': [
        'error',
        { allowList: { acc: true, env: true, i: true, props: true, src: true, ref: true } },
      ],

      'no-empty-function': 'error',
      'no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'no-console': ['warn', { allow: ['error', 'warn'] }],

      'no-warning-comments': [
        'warn',
        {
          terms: ['todo', 'fixme', 'debug', 'todo: replace any'],
          location: 'anywhere',
        },
      ],
      'spaced-comment': ['error', 'always', { markers: ['/'] }],

      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-unsafe-argument': 'error',
      '@typescript-eslint/ban-ts-comment': [
        'error',
        {
          'ts-ignore': true,
          'ts-nocheck': true,
          'ts-check': false,
          'ts-expect-error': 'allow-with-description',
        },
      ],
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: [
            './tsconfig.base.json',
            './packages/frontend/tsconfig.app.json',
            './packages/frontend/tsconfig.spec.json',
            './packages/backend/tsconfig.json',
            './packages/shared/tsconfig.json',
          ],
        },
      },
    },
  },

  {
    files: ['packages/backend/**/*.ts'],
    rules: {
      '@typescript-eslint/no-empty-object-type': [
        'error',
        { allowInterfaces: 'with-single-extends' },
      ],
      '@typescript-eslint/no-extraneous-class': ['error', { allowWithDecorator: true }],
    },
  },

  {
    files: ['packages/frontend/**/*.ts'],
    extends: [...angular.configs.tsRecommended],
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', prefix: 'app', style: 'kebab-case' },
      ],
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: 'app', style: 'camelCase' },
      ],
    },
  },

  {
    files: ['packages/frontend/**/*.html'],
    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
    rules: {},
  },

  prettierConfig,
]);
