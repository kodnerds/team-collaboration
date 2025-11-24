import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import turboPlugin from 'eslint-plugin-turbo';
import tseslint from 'typescript-eslint';
import onlyWarn from 'eslint-plugin-only-warn';
import importPlugin from 'eslint-plugin-import';
import unicornPlugin from 'eslint-plugin-unicorn';
import sonarjsPlugin from 'eslint-plugin-sonarjs';
import securityPlugin from 'eslint-plugin-security';

export const config = [
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  unicornPlugin.configs.recommended,
  sonarjsPlugin.configs.recommended,
  {
    plugins: {
      turbo: turboPlugin,
      import: importPlugin,
      onlyWarn,
      security: securityPlugin
    },
    rules: {
      'turbo/no-undeclared-env-vars': 'warn',
      'no-duplicate-imports': 'off',
      'import/no-unresolved': 'off',
      'import/named': 'error',
      'import/default': 'error',
      'import/namespace': 'error',
      'import/no-absolute-path': 'error',
      'import/no-dynamic-require': 'warn',
      'import/no-self-import': 'error',
      'import/no-cycle': 'error',
      'import/no-useless-path-segments': 'error',
      'import/newline-after-import': 'warn',
      'import/no-duplicates': 'error',
      'import/first': 'error',
      'import/no-mutable-exports': 'error',
      'import/prefer-default-export': 'off',
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'type',
            'object'
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true
          }
        }
      ],
      '@typescript-eslint/comma-dangle': 'off',
      'comma-dangle': 'off',
      'max-params': ['warn', 3],
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'variable',
          types: ['boolean'],
          format: ['PascalCase'],
          prefix: ['is', 'should', 'has', 'can', 'did', 'will', 'does']
        }
      ],
      'unicorn/filename-case': 'off',
      'unicorn/prevent-abbreviations': 'off',
      'react/require-default-props': 'off',
      'import/no-extraneous-dependencies': 'off',
      'no-console': 'error',
      'implicit-arrow-linebreak': 'off',
      'function-paren-newline': 'off',
      'object-curly-newline': 'off',
      'no-underscore-dangle': 'off',
      'linebreak-style': 'off',
      'no-confusing-arrow': 'off',
      'react/jsx-curly-newline': 'off',
      'unicorn/expiring-todo-comments': 'off',
      'unicorn/no-null': 'off',
      'unicorn/no-array-for-each': 'off',
      '@typescript-eslint/indent': 'off',
      'unicorn/catch-error-name': 'off',
      'operator-linebreak': 'off',
      'no-nested-ternary': 'off',
      'no-use-before-define': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      'max-len': [
        'error',
        {
          code: 120
        }
      ],
      'import/extensions': 'off',
      'global-require': 'off',
      'unicorn/prefer-module': 'off',
      'no-plusplus': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      indent: 'off',
      'prefer-arrow-callback': 'error',
      'func-style': ['error', 'expression'],
      'arrow-body-style': ['error', 'as-needed'],
      eqeqeq: ['error', 'always'],
      'no-var': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/explicit-member-accessibility': ['error', { accessibility: 'no-public' }],
      '@typescript-eslint/consistent-type-imports': 'error',
      'security/detect-unsafe-regex': 'warn',
      'security/detect-non-literal-regexp': 'warn',
      'security/detect-non-literal-fs-filename': 'warn',
      'sonarjs/todo-tag': 'off'
    }
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json'
      }
    }
  },
  {
    ignores: ['dist/**', 'build/**', '.next/**', 'coverage/**']
  }
];
