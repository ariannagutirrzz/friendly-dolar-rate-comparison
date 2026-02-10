import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [
    react({
      // Ensure SWC works properly on Vercel
      tsDecorators: true,
    }),
  ],
  build: {
    // Optimize for Vercel deployment
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild',
  },
})
