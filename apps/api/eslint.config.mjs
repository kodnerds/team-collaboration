import { config } from '@tc/eslint-config/base';

export default [
  {
    ignores: ['eslint.config.mjs']
  },
  ...config,
  {
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json', './test/tsconfig.json']
      }
    }
  }
];
