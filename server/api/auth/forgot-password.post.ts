import { useServerSupabase } from '@/composables/useServerSupabase'
import { z } from 'zod'

// Email schema for validation
const forgotPasswordSchema = z.object({
	email: z.string().email('Please enter a valid email address'),
})

export default defineEventHandler(async event => {
	try {
		// Get request body
		const body = await readBody(event)

		// Validate request body
		const result = forgotPasswordSchema.safeParse(body)
		if (!result.success) {
			return createError({
				statusCode: 400,
				statusMessage: 'Validation error',
				data: result.error.format(),
			})
		}

		const { email } = result.data

		// Get runtime config to access environment variables
		const config = useRuntimeConfig()

		// Use the server Supabase composable
		const { getSupabaseClient, handleSupabaseError } = useServerSupabase()
		const supabase = getSupabaseClient()

		// Send password reset email
		const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
			redirectTo: `${config.public.appUrl}/auth/reset-password/?fromMail=true`,
		})

		if (error) {
			return handleSupabaseError(error)
		}

		// Return success message
		return {
			statusCode: 200,
			body: {
				message: 'Password reset email has been sent. Please check your inbox.',
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
