import { loginSchema } from '@/validation/authSchema'
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async event => {
	try {
		// Get request body
		const body = await readBody(event)

		// Validate request body
		const result = loginSchema.safeParse(body)
		if (!result.success) {
			return {
				statusCode: 400,
				body: { error: result.error.format() },
			}
		}

		const { email, password } = result.data

		// Get runtime config to access environment variables
		const config = useRuntimeConfig()

		// Access Supabase credentials from runtime config
		const supabaseUrl = config.public.supabaseUrl
		const supabaseKey = config.public.supabaseKey

		if (!supabaseUrl || !supabaseKey) {
			throw new Error('Supabase configuration is missing')
		}

		const supabase = createClient(supabaseUrl, supabaseKey)

		// Attempt to sign in
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		})

		// Handle email confirmation errors
		if (error) {
			return createError({
				statusCode: error.status,
				message: error.message,
			})
		}

		// Return user data and session
		return {
			statusCode: 200,
			body: {
				user: data.user,
				session: {
					access_token: data.session?.access_token,
					refresh_token: data.session?.refresh_token,
					expires_at: data.session?.expires_at,
					expires_in: data.session?.expires_in,
					user: data.user,
				},
			},
		}
	} catch (error: any) {
		return createError({
			statusCode: error.status,
			message: error.message,
		})
	}
})
