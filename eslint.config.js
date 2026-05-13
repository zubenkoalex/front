import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from '@typescript-eslint/eslint-plugin';
import tseslintParser from '@typescript-eslint/parser';

export default [
  {
    ignores: ['dist'], // Игнорируем собранную директорию
  },
  {
    files: ['**/*.{ts,tsx}'], // Применяем настройки для TypeScript файлов
    languageOptions: {
      ecmaVersion: 2020, // Современный стандарт ECMAScript
      globals: globals.browser, // Глобальные переменные для браузера
      parser: tseslintParser, // Используем TypeScript парсер
    },
    plugins: {
      '@typescript-eslint': tseslint,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      // ...reactHooks.configs.recommended.rules, // Рекомендованные правила для хуков
      // 'react-refresh/only-export-components': [
      //   'warn',
      //   { allowConstantExport: true },
      // ],
      // '@typescript-eslint/no-explicit-any': 'error', // Запрещаем использование any
      // '@typescript-eslint/explicit-function-return-type': 'warn', // Требовать явного указания возвращаемого типа
      // '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }], // Удаление неиспользуемых переменных, кроме тех, что начинаются с _
    },
  },
];