import { config } from '@tc/eslint-config/react-internal';

export default [
  {
    ignores: ['eslint.config.js']
  },
  ...config,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: import.meta.dirname
      }
    }
  }
];
