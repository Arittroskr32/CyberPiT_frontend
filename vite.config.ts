import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  console.log('🔧 Vite Config - Mode:', mode);
  console.log('🔧 Vite Config - VITE_API_URL:', env.VITE_API_URL);
  
  return {
    plugins: [react()],
    server: {
      port: 5173,
      host: true, // This makes it available on all network interfaces
      strictPort: false,
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: true,
    },
    // Ensure environment variables are properly loaded
    envPrefix: 'VITE_',
    define: {
      // Ensure environment variables are available at build time
      'import.meta.env.VITE_API_URL': JSON.stringify(
        env.VITE_API_URL || 'https://cyberpit-backend.onrender.com/api'
      ),
    },
  }
})
