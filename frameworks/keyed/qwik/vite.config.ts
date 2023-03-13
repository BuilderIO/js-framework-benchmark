import { defineConfig } from 'vite';
import { qwikVite } from '@builder.io/qwik/optimizer';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(() => {
  return {
    build: {
      minify: false,
      rollupOptions: {
        output: {
          entryFileNames: '[name].js',
        }
      }
    },
    plugins: [qwikVite({
      entryStrategy: {
        type: 'single'
      },
      client: {
        input: 'src/main.tsx',
      },
    }), tsconfigPaths()],
  };
});
