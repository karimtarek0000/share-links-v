import { loginSchema } from '@/validation/authSchema'
import { useServerSupabase } from '~/composables/useServerSupabase'

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

		// Use the server Supabase composable
		const { getSupabaseClient, handleSupabaseError } = useServerSupabase()
		const supabase = getSupabaseClient()

		// Attempt to sign in
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		})

		// Handle email confirmation errors
		if (error) {
			return handleSupabaseError(error)
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
			statusCode: error.status || 500,
			message:
				error.message || 'An error occurred while processing your request',
		})
	}
})
