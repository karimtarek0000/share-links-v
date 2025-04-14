import { useServerSupabase } from '@/composables/useServerSupabase'
import { H3Event } from 'h3'

/**
 * Utility to get an authenticated Supabase client from the server middleware context
 * This centralizes the authentication logic for all profile API endpoints
 */
export async function getAuthenticatedSupabase(event: H3Event) {
	// Get token from middleware context
	const token = event.context.supabaseToken

	if (!token) {
		throw createError({
			statusCode: 401,
			statusMessage: 'Authentication token not found in request context',
		})
	}

	// Create authenticated Supabase client with the token
	const { getSupabaseClient, handleSupabaseError } = useServerSupabase()
	const supabase = getSupabaseClient()

	// Verify the token by getting the user
	const { data: authData, error: authError } = await supabase.auth.getUser(
		token,
	)

	if (authError) {
		console.error('Auth error:', authError)
		throw createError({
			statusCode: 401,
			statusMessage: 'Invalid or expired authentication token',
		})
	}

	return {
		supabase,
		userId: authData.user.id,
		handleSupabaseError,
	}
}
