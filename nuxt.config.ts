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
      navigateFallback: '/',
    },
  },
  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL,
  },
})
