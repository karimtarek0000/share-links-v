// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2024-11-01',
	devtools: { enabled: true },
	ssr: false,
	modules: ['@nuxt/ui'],
	css: ['~/assets/css/main.css'],
	ui: {
		global: true,
		icons: ['heroicons', 'simple-icons', 'f7'],
		colorMode: false,
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
