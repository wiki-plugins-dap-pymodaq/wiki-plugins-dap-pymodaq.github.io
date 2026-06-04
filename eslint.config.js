// Flat config ESLint (v9+) pour les scripts navigateur « vanilla » du wiki.
import js from '@eslint/js';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    files: ['public/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      // Scripts classiques chargés via `defer` (pas des modules ES).
      sourceType: 'script',
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      eqeqeq: 'error',
      'prefer-const': 'error',
    },
  },
];
