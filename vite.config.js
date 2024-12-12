import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./setup-tests.js",
    coverage: {
      provider: 'v8', 
      reporter: ['text', 'json', 'html'],  
      include: ['src/**/*.{ts,tsx,js,jsx}'], 
      outputDirectory: './coverage',  
      all: true, 
    },
  },
});
