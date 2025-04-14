import { H3Event } from 'h3'
import { useServerSupabase } from '~/composables/useServerSupabase'

/**
 * Utility to get an authenticated Supabase client from the server middleware context
 * This centralizes the authentication logic for all profile API endpoints
 */
export async function getAuthenticatedSupabase() {
	// Create authenticated Supabase client
	const { getSupabaseClient, handleSupabaseError } = useServerSupabase()
	const supabase = getSupabaseClient()

	// Verify the token by getting the user
	const { data: authData, error: authError } = await supabase.auth.getUser()

	if (authError) {
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
