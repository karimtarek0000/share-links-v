import { getAuthenticatedSupabase } from '@/server/utils/supabase'
import { profileTableSchema } from '@/validation/profileSchema'
import { z } from 'zod'

export default defineEventHandler(async event => {
	try {
		// Get authenticated Supabase client using our utility function
		const { supabase, supabaseAdmin, userId, handleSupabaseError } =
			await getAuthenticatedSupabase(event)

		// Get and validate request body
		const body = await readBody(event)
		const result = profileTableSchema.safeParse(body)

		if (!result.success) {
			return createError({
				statusCode: 400,
				statusMessage: 'Validation error',
				data: result.error.format(),
			})
		}

		const { user_id, name, bio, img, social_links } = result.data

		// Ensure user can only create a profile for themselves
		if (userId !== user_id) {
			return createError({
				statusCode: 403,
				statusMessage: 'You can only create a profile for yourself',
			})
		}

		// Check if profile already exists
		const { data: existingProfile, error: checkError } = await supabase
			.from('profiles')
			.select('user_id')
			.eq('user_id', user_id)
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

		// Create the profile data object
		const profileData = {
			user_id,
			name,
			bio,
			img,
			social_links,
		}

		// Try with regular authenticated client first
		const { data, error } = await insertProfile(supabase, profileData)

		// If that fails with RLS error and we have an admin client, try with admin client
		if (error && isRLSError(error) && supabaseAdmin) {
			const { data: adminData, error: adminError } = await insertProfile(
				supabaseAdmin,
				profileData,
			)

			if (adminError) {
				return handleSupabaseError(adminError)
			}

			// Set status code to 201 for successful creation
			setResponseStatus(event, 201)
			return adminData[0]
		}

		if (error) {
			return handleSupabaseError(error)
		}

		// Set status code to 201 for successful creation
		setResponseStatus(event, 201)
		return data[0]
	} catch (err) {
		const error = err as Error
		return createError({
			statusCode: 'statusCode' in error ? Number(error.statusCode) : 500,
			statusMessage:
				'statusMessage' in error
					? String(error.statusMessage)
					: error.message || 'An error occurred creating the profile',
		})
	}
})

// Helper function to insert profile
async function insertProfile(
	client: any,
	profileData: z.infer<typeof profileTableSchema>,
) {
	try {
		return await client.from('profiles').insert(profileData).select()
	} catch (e) {
		console.error('Exception during profile insert:', e)
		return { data: null, error: e as Error }
	}
}

// Helper to check for RLS errors
function isRLSError(error: any): boolean {
	return (
		error.code === '42501' ||
		(typeof error.message === 'string' &&
			error.message.includes('violates row-level security'))
	)
}
