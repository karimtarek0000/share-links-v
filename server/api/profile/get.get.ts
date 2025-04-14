import { useServerSupabase } from '@/composables/useServerSupabase'

export default defineEventHandler(async event => {
	try {
		// Get query parameters
		const query = getQuery(event)
		const userId = query.userId as string

		if (!userId) {
			return createError({
				statusCode: 400,
				statusMessage: 'User ID is required',
			})
		}

		// Use the server Supabase composable
		const { getSupabaseClient, handleSupabaseError } = useServerSupabase()
		const supabase = getSupabaseClient()

		// Get profile by userId
		const { data, error } = await supabase
			.from('profiles')
			.select('*')
			.eq('userId', userId)
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
			statusCode: 500,
			statusMessage: err.message || 'An error occurred retrieving the profile',
		})
	}
})
