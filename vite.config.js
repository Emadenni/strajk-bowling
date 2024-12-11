import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'istanbul', 
      reporter: ['text', 'json', 'html'], 
      reportsDirectory: './coverage',    
      include: ['src/**/*.{js,ts,jsx,tsx}'], 
      exclude: ['node_modules', 'test/**/*'], 
    },
  },
});
