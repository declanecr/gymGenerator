// eslint.config.js
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  {
    ignores: ['dist', 'node_modules'],
    languageOptions: {
      sourceType: 'module',
    },
    rules: {
      // your custom rules here
    },
  },
  prettier,
];
