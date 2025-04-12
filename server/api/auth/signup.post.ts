import { signupSchema } from '@/validation/authSchema'
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async event => {
	try {
		// Get request body
		const body = await readBody(event)
		const { name, email, password } = body

		// Validate request body
		const result = signupSchema.safeParse({
			name,
			email,
			password,
			confirmPassword: password,
		})
		if (!result.success) {
			return createError({
				statusCode: 400,
				statusMessage: 'Validation error',
				data: result.error.format(),
			})
		}

		// Get runtime config to access environment variables
		const config = useRuntimeConfig()

		// Access Supabase credentials from runtime config
		const supabaseUrl = config.public.supabaseUrl
		const supabaseKey = config.public.supabaseKey

		if (!supabaseUrl || !supabaseKey) {
			return createError({
				message: 'Supabase configuration is missing',
			})
		}

		const supabase = createClient(supabaseUrl, supabaseKey)

		// Sign up with email confirmation enabled
		const { data, error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: { name },
				emailRedirectTo: `${config.public.appUrl}/auth/confirm-email`,
			},
		})

		if (error) {
			return createError({
				statusCode: error.status,
				message: error.message,
			})
		}

		// Return user data, session and confirmation message
		return {
			statusCode: 200,
			body: {
				user: data.user,
				session: data.session,
				message:
					'Registration successful. Please check your email to confirm your account.',
			},
		}
	} catch (error: any) {
		return createError({
			statusCode: error.status,
			message: error.message,
		})
	}
})
