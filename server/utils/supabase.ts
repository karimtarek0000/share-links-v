import { createClient } from '@supabase/supabase-js'
import { H3Event } from 'h3'

/**
 * Utility to get authenticated Supabase clients from the server middleware context
 * This centralizes the authentication logic for all profile API endpoints
 */
export async function getAuthenticatedSupabase(event: H3Event) {
	try {
		// Get token from middleware context
		const token = event.context.supabaseToken

		if (!token) {
			throw createError({
				statusCode: 401,
				statusMessage: 'Authentication token not found in request context',
			})
		}

		// Get runtime config
		const config = useRuntimeConfig()
		const supabaseUrl = config.public.supabaseUrl
		const supabaseKey = config.public.supabaseKey
		const serviceRoleKey = config.supabaseServiceKey

		if (!serviceRoleKey) {
			throw createError({
				statusCode: 500,
				statusMessage:
					'SUPABASE_SERVICE_ROLE_KEY is not defined in environment variables',
			})
		}

		// Common client options
		const clientOptions = {
			auth: {
				autoRefreshToken: false,
				persistSession: false,
			},
		}

		// Create authenticated client with user token
		const supabase = createClient(supabaseUrl, supabaseKey, {
			...clientOptions,
			global: {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			},
		})

		// Create admin client with service role key (bypasses RLS)
		const supabaseAdmin = createClient(
			supabaseUrl,
			serviceRoleKey,
			clientOptions,
		)

		// Verify the token by getting the user
		const {
			data: { user },
			error: authError,
		} = await supabase.auth.getUser()

		if (authError || !user) {
			throw createError({
				statusCode: 401,
				statusMessage: 'Invalid or expired authentication token',
			})
		}

		return {
			supabase,
			supabaseAdmin,
			userId: user.id,
			handleSupabaseError: (error: any) => {
				return createError({
					statusCode: error.code === '23505' ? 409 : 500,
					statusMessage: error.message || 'Database operation failed',
				})
			},
		}
	} catch (error: any) {
		throw createError({
			statusCode: error.statusCode || 500,
			statusMessage: error.statusMessage || 'Authentication failed',
		})
	}
}
