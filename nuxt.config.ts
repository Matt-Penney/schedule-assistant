import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/test-utils',
    '@vite-pwa/nuxt',
    '@vueuse/nuxt',
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
})
