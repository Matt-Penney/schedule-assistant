import process from 'node:process'
import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/test-utils',
    '@vite-pwa/nuxt',
    '@vueuse/nuxt',
    '@nuxt/ui',
    '@formkit/nuxt',
    '@nuxt/devtools',
  ],
  compatibilityDate: '2025-07-15',
  devtools: {
    enabled: true,
  },
  eslint: {
    config: {
      standalone: false,
    },
  },
  typescript: {
    tsConfig: {
      compilerOptions: {
        paths: {
          '@lib/*': ['../../../lib/*'],
        },
      },
    },
  },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  css: ['~/assets/css/main.css'],
  devServer: {
    port: 3000,
  },
  app: {
    head: {
      title: 'Jarvis Bot',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { charset: 'utf-8' },
      ],
    },
  },
  formkit: {
    // Experimental support for auto loading (see note):
    autoImport: false,
  },
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Jarvis Bot',
      short_name: 'Jarvis',
      theme_color: '#FFA500',
      start_url: '/',
      display: 'standalone',
      icons: [
        { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
        { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png' },
      ],
    },
    workbox: {
      // navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
    },
    injectManifest: {
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
    },
    srcDir: 'public',
    // srcDir: 'service-worker',
    // filename: 'sw.ts',
    // client: {
    //   installPrompt: true,
    //   // you don't need to include this: only for testing purposes
    //   // if enabling periodic sync for update use 1 hour or so (periodicSyncForUpdates: 3600)
    //   periodicSyncForUpdates: 20,
    // },
    devOptions: {
      enabled: true,
    },
    // devOptions: {
    //   enabled: true,
    //   suppressWarnings: true,
    //   navigateFallback: '/',
    //   navigateFallbackAllowlist: [/^\/$/],
    //   type: 'module',
    // },
  },
  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL,
    openaiApiKey: process.env.OPENAI_API_KEY,
    vapidPrivateKey: process.env.NUXT_VAPID_PRIVATE_KEY,
    public: {
      vapidPublicKey: process.env.NUXT_VAPID_PUBLIC_KEY,
    },
  },
})
