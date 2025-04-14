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

		// Check if profile already exists
		const { data: existingProfile, error: checkError } = await supabase
			.from('profiles')
			.select('userId')
			.eq('userId', userId)
			.single()

		if (checkError && checkError.code !== 'PGRST116') {
			return handleSupabaseError(checkError)
		}

		if (existingProfile) {
			return createError({
				statusCode: 400,
				statusMessage: 'Profile already exists for this user',
			})
		}

		// Insert new profile
		const { data, error } = await supabase
			.from('profiles')
			.insert({
				userId,
				name,
				bio,
				img,
				socialLinks,
			})
			.select()

		if (error) {
			return handleSupabaseError(error)
		}

		return {
			statusCode: 201,
			body: data[0],
		}
	} catch (err: any) {
		return createError({
			statusCode: 500,
			statusMessage: err.message || 'An error occurred creating the profile',
		})
	}
})
