import {defineConfig} from 'vite';
import path from 'path';

// https://vitejs.dev/config
export default defineConfig({
    resolve: {
        // Some libs that can run in both Web and Node.js, such as `axios`, we need to tell Vite to build them in Node.js.
        mainFields: ['module', 'jsnext:main', 'jsnext'],
        alias: {
            '@main': path.resolve(__dirname, './src/main'),
        },
    },
    build: {
        rollupOptions: {
            external: ['better-sqlite3', 'mqtt', 'ffmpeg-static'],
        },
    },
});
