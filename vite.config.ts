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

    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            // react core
            if (id.includes('react') && !id.includes('radix')) return 'react'

            // radix UI
            if (id.includes('@radix-ui')) return 'radix-ui'

            // lucide icons
            if (id.includes('lucide-react')) return 'icons'

            // charts
            if (id.includes('recharts')) return 'charts'

            // date utils
            if (id.includes('date-fns')) return 'date-fns'

            // map
            if (id.includes('leaflet') || id.includes('react-leaflet')) {
              return 'map'
            }

            // capacitor
            if (id.includes('@capacitor')) return 'capacitor'

            // framer-motion
            if (id.includes('framer-motion')) return 'motion'

            // UI libs nhỏ khác
            if (
              id.includes('sonner') ||
              id.includes('vaul') ||
              id.includes('class-variance-authority')
            ) {
              return 'ui'
            }

            // utils
            if (
              id.includes('axios') ||
              id.includes('clsx') ||
              id.includes('tailwind-merge')
            ) {
              return 'utils'
            }

            // default vendor
            if (id.includes('node_modules')) {
              return 'vendor'
            }
          },
        },
      },

      chunkSizeWarningLimit: 1200,
    },
  }
})
