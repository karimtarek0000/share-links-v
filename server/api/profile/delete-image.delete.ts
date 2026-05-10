import { getAuthenticatedSupabase } from '@/server/utils/supabase'

export default defineEventHandler(async event => {
  try {
    const { supabase, userId, handleSupabaseError } = await getAuthenticatedSupabase(event)
    const { user_id, imagePath } = await readBody(event)

    // Validate request data
    validateRequestData(userId, user_id, imagePath)

    // Check if this is a blob/local preview path that was never uploaded
    const isLocalPreview =
      imagePath.startsWith('blob:') ||
      imagePath.startsWith('localhost:') ||
      imagePath.includes('localhost:') ||
      imagePath.includes('127.0.0.1')

    if (isLocalPreview) {
      // No storage delete needed for local previews
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ img: null })
        .eq('user_id', user_id)

      if (updateError) {
        return handleSupabaseError(updateError)
      }

      return {
        statusCode: 200,
        body: { message: 'Image preview removed' },
      }
    }

    // Process image path for actual stored images
    const path = extractImagePath(imagePath, user_id)

    // Delete image from storage
    const { error: deleteError } = await supabase.storage.from('profile-images').remove([path])

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
      statusMessage: err.statusMessage || err.message || 'An error occurred deleting the image',
    })
  }
})

// Helper functions
function validateRequestData(authUserId: string, requestUserId: string, imagePath: string) {
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

  // Remove query parameters and fragments
  const cleanPath = imagePath.split('?')[0].split('#')[0].trim()

  // Case 1: Path already in correct format: userId/filename
  if (cleanPath.startsWith(`${userId}/`)) {
    return cleanPath
  }

  // Case 2: Handle full Supabase public URL
  // Extract the path part after 'profile-images/'
  if (cleanPath.includes('profile-images/')) {
    const parts = cleanPath.split('profile-images/')
    if (parts.length > 1) {
      const pathPart = parts[1]
      // Verify the path starts with the userId
      if (pathPart && pathPart.startsWith(userId)) {
        return pathPart
      }
    }
  }

  // Case 3: Try to extract filename if userId is in the path
  if (cleanPath.includes(userId)) {
    const parts = cleanPath.split(userId)
    if (parts.length > 1) {
      const filename = parts[1].replace(/^[\/\-]/, '')
      if (filename) {
        return `${userId}/${filename}`
      }
    }
  }

  // Not authorized if we can't create a valid path
  throw createError({
    statusCode: 403,
    statusMessage: 'Not authorized to delete this image',
  })
}
