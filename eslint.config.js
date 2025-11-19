import { config } from '@tc/eslint-config/base';

export default [
  // Global ignores - these folders will be completely ignored by ESLint
  {
    ignores: [
      // Workspace directories (let them handle their own linting)
      'apps/**',
      'packages/**',

      // Dependencies and build outputs
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/.next/**',
      '**/out/**',

      // Cache and temporary directories
      '**/.turbo/**',
      '**/.cache/**',
      '**/coverage/**',
      '**/tmp/**',

      // Lock files and configs that shouldn't be linted
      '**/pnpm-lock.yaml',
      '**/package-lock.json',
      '**/yarn.lock',

      // OS and IDE files
      '**/.DS_Store',
      '**/.vscode/**',
      '**/.idea/**',

      // Git directory
      '**/.git/**'
    ]
  },

  // Apply base config to remaining files
  ...config
];
