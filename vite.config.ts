import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // load .env, .env.local, .env.[mode] automatically
  const env = loadEnv(mode, process.cwd(), '')

  // expose all .env variables to process.env
  for (const k in env) {
    process.env[k] = env[k]
  }

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      allowedHosts: [
        '.ngrok-free.app',
        '.ngrok.app',
        '.khoav4.com',
      ],
    },
    // optional: inject custom env vars into code
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV),
    },
  }
})
