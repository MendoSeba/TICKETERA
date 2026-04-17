import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: '0.0.0.0'
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@services': '/src/service',
      '@routes': '/src/routes',
      '@utils': '/src/utils'
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'firebase/app', 'firebase/auth', 'firebase/firestore']
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/__tests__/setup.js',
  }
})
