import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { viteSingleFile } from 'vite-plugin-singlefile';

const standalone = !!process.env.STANDALONE;

export default defineConfig({
  base: standalone ? './' : process.env.BASE_PATH || '/',
  plugins: standalone ? [viteSingleFile({ removeViteModuleLoader: true })] : [],
  server: { port: 5179, host: '127.0.0.1' },
  preview: { port: 4179, host: '127.0.0.1' },
  build: {
    target: 'es2022',
    assetsInlineLimit: 0,
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      input: standalone ? resolve(__dirname, 'index.html') : { main: resolve(__dirname, 'index.html'), specimen: resolve(__dirname, 'specimen.html') },
      output: standalone ? {} : { manualChunks: (id) => (id.includes('node_modules/three') ? 'three' : undefined) },
    },
  },
});
