import { useServerSupabase } from '@/composables/useServerSupabase'
import { profileTableSchema } from '@/validation/profileTableSchema'

export default defineEventHandler(async event => {
	try {
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

		const { userId, name, bio, img, socialLinks } = result.data

		// Use the server Supabase composable
		const { getSupabaseClient, handleSupabaseError } = useServerSupabase()
		const supabase = getSupabaseClient()

		// Check if profile exists before updating
		const { data: existingProfile, error: checkError } = await supabase
			.from('profiles')
			.select('userId')
			.eq('userId', userId)
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
				socialLinks,
			})
			.eq('userId', userId)
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
			statusCode: 500,
			statusMessage: err.message || 'An error occurred updating the profile',
		})
	}
})
