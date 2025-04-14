import { getAuthenticatedSupabase } from '@/server/utils/supabase'

export default defineEventHandler(async event => {
	try {
		// Get authenticated Supabase client using our utility function
		const { supabase, userId, handleSupabaseError } =
			await getAuthenticatedSupabase(event)

		// Get request body
		const body = await readBody(event)
		const { user_id, imagePath } = body

		if (!user_id) {
			return createError({
				statusCode: 400,
				statusMessage: 'User ID is required',
			})
		}

		// Ensure user can only delete their own images
		if (userId !== user_id) {
			return createError({
				statusCode: 403,
				statusMessage: 'You can only delete your own images',
			})
		}

		if (!imagePath) {
			return createError({
				statusCode: 400,
				statusMessage: 'Image path is required',
			})
		}

		// Check if image is a default image
		if (
			imagePath.includes('default') ||
			!imagePath.includes('profile-images')
		) {
			return createError({
				statusCode: 400,
				statusMessage: 'Cannot delete default or external images',
			})
		}

		// Extract path from the full URL
		const pathParts = imagePath.split('profile-images/')
		if (pathParts.length <= 1) {
			return createError({
				statusCode: 400,
				statusMessage: 'Invalid image path format',
			})
		}

		const path = pathParts[1]

		// Check if the image belongs to the user (security check)
		if (!path.startsWith(user_id)) {
			return createError({
				statusCode: 403,
				statusMessage: 'Not authorized to delete this image',
			})
		}

		// Delete the image from storage
		const { error: deleteError } = await supabase.storage
			.from('profile-images')
			.remove([path])

		if (deleteError) {
			return handleSupabaseError(deleteError)
		}

		// Update profile with null image
		const { error: updateError } = await supabase
			.from('profiles')
			.update({ img: null })
			.eq('user_id', user_id)

		if (updateError) {
			return handleSupabaseError(updateError)
		}

		return {
			statusCode: 200,
			body: {
				message: 'Image deleted successfully',
			},
		}
	} catch (err: any) {
		return createError({
			statusCode: err.statusCode || 500,
			statusMessage:
				err.statusMessage ||
				err.message ||
				'An error occurred deleting the image',
		})
	}
})
