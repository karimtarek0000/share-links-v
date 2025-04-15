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
			console.error('Error deleting image:', deleteError)
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

function extractImagePath(imagePath: string, userId: string) {
	let path = ''

	if (imagePath.includes('profile-images/')) {
		const pathParts = imagePath.split('profile-images/')
		if (pathParts.length > 1) {
			path = pathParts[1]
		}
	} else {
		path = imagePath
	}

	if (!path) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Invalid image path format',
		})
	}

	if (!path.startsWith(userId) && !path.includes(userId)) {
		throw createError({
			statusCode: 403,
			statusMessage: 'Not authorized to delete this image',
		})
	}

	return path
}
