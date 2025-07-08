// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxt/ui'],
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      titleTemplate: '%s | Share Profile Links',
      meta: [
        { charset: 'utf-8' },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1, maximum-scale=1',
        },
        { name: 'description', content: 'Share your profile links easily.' },
      ],
      link: [
        {
          rel: 'icon',
          type: 'image/png',
          href: '/favicons/favicon-96x96.png',
          sizes: '96x96',
        },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicons/favicon.svg' },
        { rel: 'shortcut icon', href: '/favicons/favicon.ico' },
        {
          rel: 'apple-touch-icon',
          sizes: '180x180',
          href: '/favicons/apple-touch-icon.png',
        },
      ],
    },
  },
  ui: {
    colorMode: false,
  },
  // Vite configuration to fix Tailwind CSS sourcemap warning
  vite: {
    css: {
      devSourcemap: false,
    },
    build: {
      sourcemap: false,
      rollupOptions: {
        onwarn(warning, warn) {
          // Suppress Tailwind CSS sourcemap warnings
          if (
            warning.code === 'SOURCEMAP_ERROR' &&
            warning.message.includes('@tailwindcss/vite:generate:build')
          ) {
            return
          }
          // Suppress @nuxt/ui circular dependency warnings
          if (
            warning.code === 'CIRCULAR_DEPENDENCY' &&
            warning.message?.includes('DropdownMenuContent.vue')
          ) {
            return
          }
          // Suppress Nitro internal circular dependency warnings
          if (
            warning.code === 'CIRCULAR_DEPENDENCY' &&
            (warning.message?.includes('nitropack/dist/runtime/internal') ||
              warning.message?.includes('@nuxt/icon/dist/runtime/server'))
          ) {
            return
          }
          warn(warning)
        },
      },
    },
  },
  // Nitro configuration to suppress warnings
  nitro: {
    rollupConfig: {
      onwarn(warning, warn) {
        // Suppress Tailwind CSS sourcemap warnings
        if (
          warning.code === 'SOURCEMAP_ERROR' ||
          (warning.plugin === '@tailwindcss/vite:generate:build' &&
            warning.message?.includes('Sourcemap'))
        ) {
          return
        }
        // Suppress @nuxt/ui circular dependency warnings
        if (
          warning.code === 'CIRCULAR_DEPENDENCY' &&
          (warning.message?.includes('DropdownMenuContent.vue') ||
            warning.message?.includes('_nuxt/ui/dist/runtime/components'))
        ) {
          return
        }
        // Suppress Nitro internal circular dependency warnings
        if (
          warning.code === 'CIRCULAR_DEPENDENCY' &&
          (warning.message?.includes('nitropack/dist/runtime/internal') ||
            warning.message?.includes('virtual:#nitro-internal') ||
            warning.message?.includes('@nuxt/icon/dist/runtime/server') ||
            warning.message?.includes('nuxt/dist/core/runtime/nitro'))
        ) {
          return
        }
        warn(warning)
      },
    },
  },
  // Enable sourcemaps for CSS processing
  sourcemap: {
    server: true,
    client: true,
  },
  // Hybrid rendering configuration using routeRules
  routeRules: {
    '/**': { ssr: false },
    '/error': { prerender: true },
    '/profile/**': { ssr: true },
    '/auth/**': { prerender: true },
  },
  // Runtime config for environment variables
  runtimeConfig: {
    // Private keys (server-side only)
    supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    // Keys within public are exposed to the client
    public: {
      appUrl: process.env.NUXT_PUBLIC_APP_URL,
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY,
    },
  },
})
