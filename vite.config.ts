import path from 'node:path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

// https://vite.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            '@src': path.resolve(__dirname, './src'),
            '@app': path.resolve(__dirname, './src/1_app'),
            '@pages': path.resolve(__dirname, './src/2_pages'),
            '@features': path.resolve(__dirname, './src/3_features'),
            '@entities': path.resolve(__dirname, './src/4_entities'),
            '@shared': path.resolve(__dirname, './src/5_shared'),
        },
    },
    plugins: [react()],
    server: {
        port: 3000,
    },
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: [path.resolve(__dirname, './src/5_shared/services/test/beforeScript.ts')],
    },
});
