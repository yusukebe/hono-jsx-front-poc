import { defineConfig } from 'vite'
import devServer from '@hono/vite-dev-server'
import componentTransformerPlugin from './src/vite-plugin'

export default defineConfig(({ mode }) => {
  if (mode === 'client') {
    return {
      build: {
        minify: true,
        rollupOptions: {
          input: ['./app/client.tsx'],
          output: {
            entryFileNames: 'static/client.js'
          }
        },
        emptyOutDir: false,
        copyPublicDir: false
      },
      plugins: [componentTransformerPlugin()]
    }
  } else {
    return {
      ssr: {
        noExternal: true
      },
      build: {
        minify: true,
        ssr: './_worker.ts'
      },
      plugins: [
        devServer({
          entry: './app/server.tsx'
        }),
        componentTransformerPlugin()
      ]
    }
  }
})
