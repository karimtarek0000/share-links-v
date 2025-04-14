import { getAuthenticatedSupabase } from '@/server/utils/supabase'

export default defineEventHandler(async event => {
	try {
		// Get authenticated Supabase client using our utility function
		const { supabase, userId, handleSupabaseError } =
			await getAuthenticatedSupabase(event)

		// Parse multipart form data
		const formData = await readMultipartFormData(event)

		if (!formData || formData.length === 0) {
			return createError({
				statusCode: 400,
				statusMessage: 'No file uploaded',
			})
		}

		// Get the file data
		const fileData = formData.find(item => item.name === 'file')
		if (!fileData || !fileData.data || !fileData.filename) {
			return createError({
				statusCode: 400,
				statusMessage: 'Invalid file data',
			})
		}

		// Get user ID from form data
		const userIdField = formData.find(item => item.name === 'user_id')
		if (!userIdField || !userIdField.data) {
			return createError({
				statusCode: 400,
				statusMessage: 'User ID is required',
			})
		}

		const user_id = Buffer.from(userIdField.data).toString('utf-8')

		// Ensure user can only upload images for their own profile
		if (userId !== user_id) {
			return createError({
				statusCode: 403,
				statusMessage: 'You can only upload images for your own profile',
			})
		}

		// Check file type and size
		const fileType = fileData.type || 'application/octet-stream'

		if (!fileType.startsWith('image/')) {
			return createError({
				statusCode: 400,
				statusMessage: 'Only image files are allowed',
			})
		}

		// Check file size (limit to 5MB)
		const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
		if (fileData.data.length > MAX_FILE_SIZE) {
			return createError({
				statusCode: 400,
				statusMessage: 'File size exceeds the 5MB limit',
			})
		}

		// Generate a unique filename
		const fileExtension = fileData.filename.split('.').pop()
		const uniqueFilename = `${user_id}-${Date.now()}.${fileExtension}`

		// Upload to Supabase Storage
		const { data, error } = await supabase.storage
			.from('profile-images')
			.upload(uniqueFilename, fileData.data, {
				contentType: fileType,
				upsert: true,
			})

		if (error) {
			return handleSupabaseError(error)
		}

		// Get the public URL for the uploaded image
		const { data: publicUrlData } = supabase.storage
			.from('profile-images')
			.getPublicUrl(uniqueFilename)

		return {
			statusCode: 200,
			body: {
				path: data.path,
				publicUrl: publicUrlData.publicUrl,
			},
		}
	} catch (err: any) {
		return createError({
			statusCode: err.statusCode || 500,
			statusMessage:
				err.statusMessage ||
				err.message ||
				'An error occurred uploading the image',
		})
	}
})
