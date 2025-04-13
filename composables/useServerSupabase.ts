import { createClient } from '@supabase/supabase-js'

/**
 * Server-side Supabase utility composable
 * This handles common Supabase operations used across server endpoints
 */
export const useServerSupabase = () => {
	// Initialize Supabase client for server-side operations
	const getSupabaseClient = () => {
		// Get runtime config to access environment variables
		const config = useRuntimeConfig()

		// Access Supabase credentials from runtime config
		const supabaseUrl = config.public.supabaseUrl
		const supabaseKey = config.public.supabaseKey

		if (!supabaseUrl || !supabaseKey) {
			throw createError({
				statusCode: 500,
				message: 'Supabase configuration is missing',
			})
		}

		return createClient(supabaseUrl, supabaseKey)
	}

	// Common error handler for Supabase operations
	const handleSupabaseError = (error: any) => {
		return createError({
			statusCode: error.status || 500,
			message:
				error.message || 'An error occurred with the authentication service',
		})
	}

	return {
		getSupabaseClient,
		handleSupabaseError,
	}
}
