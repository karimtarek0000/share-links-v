import { getAuthenticatedSupabase } from '@/server/utils/supabase'

export default defineEventHandler(async event => {
	try {
		// Get authenticated Supabase client using our utility function
		const { supabase, handleSupabaseError } = await getAuthenticatedSupabase()

		// Get query parameters
		const query = getQuery(event)
		const user_id = query.user_id as string

		if (!user_id) {
			return createError({
				statusCode: 400,
				statusMessage: 'User ID is required',
			})
		}

		// Get profile by user_id
		const { data, error } = await supabase
			.from('profiles')
			.select('*')
			.eq('user_id', user_id)
			.single()

		if (error) {
			// If record not found, return appropriate message
			if (error.code === 'PGRST116') {
				return createError({
					statusCode: 404,
					statusMessage: 'Profile not found',
				})
			}
			return handleSupabaseError(error)
		}

		return {
			statusCode: 200,
			body: data,
		}
	} catch (err: any) {
		return createError({
			statusCode: err.statusCode || 500,
			statusMessage:
				err.statusMessage ||
				err.message ||
				'An error occurred retrieving the profile',
		})
	}
})
