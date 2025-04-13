import { useServerSupabase } from '@/composables/useServerSupabase'
import { signupSchema } from '@/validation/authSchema'

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

		// Use the server Supabase composable
		const { getSupabaseClient, handleSupabaseError } = useServerSupabase()
		const supabase = getSupabaseClient()

		// Sign up with email confirmation enabled
		const { data, error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: { name },
				emailRedirectTo: `${config.public.appUrl}/auth/login`,
			},
		})

		if (error) {
			return handleSupabaseError(error)
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
			statusCode: error.status || 500,
			message: error.message || 'An error occurred during signup',
		})
	}
})
