import { getAuthenticatedSupabase } from '@/server/utils/supabase'

export default defineEventHandler(async event => {
	try {
		const { supabase, userId, handleSupabaseError } =
			await getAuthenticatedSupabase(event)
		const { user_id, imagePath } = await readBody(event)

		// Validate request data
		validateRequestData(userId, user_id, imagePath)

		// Process image path
		const path = extractImagePath(imagePath, user_id)

		// Delete image from storage
		const { error: deleteError } = await supabase.storage
			.from('profile-images')
			.remove([path])

		if (deleteError) {
			return handleSupabaseError(deleteError)
		}

		// Update profile in database
		const { error: updateError } = await supabase
			.from('profiles')
			.update({ img: null })
			.eq('user_id', user_id)

		if (updateError) {
			return handleSupabaseError(updateError)
		}

		return {
			statusCode: 200,
			body: { message: 'Image deleted successfully' },
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

// Helper functions
function validateRequestData(
	authUserId: string,
	requestUserId: string,
	imagePath: string,
) {
	if (!requestUserId) {
		throw createError({
			statusCode: 400,
			statusMessage: 'User ID is required',
		})
	}

	if (authUserId !== requestUserId) {
		throw createError({
			statusCode: 403,
			statusMessage: 'You can only delete your own images',
		})
	}

	if (!imagePath) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Image path is required',
		})
	}

	if (imagePath.includes('default')) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Cannot delete default images',
		})
	}
}

function extractImagePath(imagePath: string, userId: string): string {
	// Validate path is not empty
	if (!imagePath) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Invalid image path format',
		})
	}

	// Path already in correct format: userId/filename
	if (imagePath.startsWith(`${userId}/`)) {
		return imagePath
	}

	// Try to extract filename if userId is in the path
	if (imagePath.includes(userId)) {
		const parts = imagePath.split(userId)
		if (parts.length > 1) {
			const filename = parts[1].replace(/^[\/\-]/, '')
			return `${userId}/${filename}`
		}
	}

	// Not authorized if we can't create a valid path
	throw createError({
		statusCode: 403,
		statusMessage: 'Not authorized to delete this image',
	})
}
