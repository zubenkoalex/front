import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // Использование относительных путей
  build: {
    outDir: 'dist', // Выходная директория
    assetsDir: 'assets', // Каталог для статических файлов
    emptyOutDir: true, // Очищать выходную директорию перед сборкой
  },
  server: {
    open: false, // Отключаем автоматическое открытие браузера
    port: 5173,
  },
});