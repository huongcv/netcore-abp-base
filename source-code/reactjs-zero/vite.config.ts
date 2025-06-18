import {defineConfig} from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import path from "path";
import tailwindcss from 'tailwindcss';
// https://vitejs.dev/config/
export default defineConfig({
    build: {
        outDir: 'build',
        rollupOptions: {
            output: {
                entryFileNames: 'assets/[name].[hash].js',
                chunkFileNames: 'assets/[name].[hash].js',
                assetFileNames: 'assets/[name].[hash].[ext]',
            },
        },
    },
    plugins: [reactRefresh()],
    css: {
        postcss: {
            plugins: [tailwindcss()],
        },
    },
    resolve: {
        alias: {
            "@ord-core": path.resolve(__dirname, "./src/core/"),
            "@pages": path.resolve(__dirname, "./src/pages/"),
            "@ord-components": path.resolve(__dirname, "./src/components/"),
            "@ord-store": path.resolve(__dirname, "./src/stores/"),
            "@config": path.resolve(__dirname, "./src/config/"),
            "@api": path.resolve(__dirname, "./src/api/"),

        }

    }
})
