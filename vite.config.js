import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  resolve: {
    alias: [
      {
        find: './songs-extra.js',
        replacement: fileURLToPath(
          new URL(
            './src/songs-extra-all.js',
            import.meta.url
          )
        ),
      },
      {
        find: './songs.js',
        replacement: fileURLToPath(
          new URL(
            './src/songs-all.js',
            import.meta.url
          )
        ),
      },
    ],
  },
})
