import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import suidPlugin from "@suid/vite-plugin";
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths(), solidPlugin(), suidPlugin()],
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
});
