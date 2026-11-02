import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Современный синтаксис: меньше трансформаций и меньше итоговый код.
    target: 'es2022',
    cssMinify: 'lightningcss',
    assetsInlineLimit: 4096,
    reportCompressedSize: false,
    rollupOptions: {
      output: {
        // Разносим вендорный код по отдельным чанкам: они не меняются
        // при правках компонентов и остаются в кэше браузера.
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (/[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) return 'react'
          if (/[\\/]node_modules[\\/](framer-motion|motion|motion-dom|motion-utils)[\\/]/.test(id)) {
            return 'motion'
          }
          return
        },
      },
    },
  },
})
