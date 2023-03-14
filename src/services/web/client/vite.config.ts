import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
// https://vitejs.dev/config/
export default defineConfig({
  mode: 'production',
  plugins: [react()],
  build: {
    outDir: 'dist/client'
  }
})
