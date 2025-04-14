import { profileTableSchema } from '@/validation/profileTableSchema'
import { getAuthenticatedSupabase } from '@/server/utils/supabase'

export default defineEventHandler(async event => {
	try {
		// Get authenticated Supabase client using our utility function
		const { supabase, userId, handleSupabaseError } =
			await getAuthenticatedSupabase()

		// Get request body
		const body = await readBody(event)

		// Validate request body
		const result = profileTableSchema.safeParse(body)
		if (!result.success) {
			return createError({
				statusCode: 400,
				statusMessage: 'Validation error',
				data: result.error.format(),
			})
		}

		const { user_id, name, bio, img, social_links } = result.data

		// Ensure user can only update their own profile
		if (userId !== user_id) {
			return createError({
				statusCode: 403,
				statusMessage: 'You can only update your own profile',
			})
		}

		// Check if profile exists before updating
		const { data: existingProfile, error: checkError } = await supabase
			.from('profiles')
			.select('user_id')
			.eq('user_id', user_id)
			.single()

		if (checkError) {
			// If record not found, return appropriate message
			if (checkError.code === 'PGRST116') {
				return createError({
					statusCode: 404,
					statusMessage: 'Profile not found',
				})
			}
			return handleSupabaseError(checkError)
		}

		// Update the profile
		const { data, error } = await supabase
			.from('profiles')
			.update({
				name,
				bio,
				img,
				social_links,
			})
			.eq('user_id', user_id)
			.select()

		if (error) {
			return handleSupabaseError(error)
		}

		return {
			statusCode: 200,
			body: data[0],
		}
	} catch (err: any) {
		return createError({
			statusCode: err.statusCode || 500,
			statusMessage:
				err.statusMessage ||
				err.message ||
				'An error occurred updating the profile',
		})
	}
})
