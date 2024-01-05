import { defineConfig } from 'vite'
import devServer from '@hono/vite-dev-server'

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
      }
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
        })
      ]
    }
  }
})
