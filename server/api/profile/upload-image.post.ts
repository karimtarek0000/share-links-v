import { getAuthenticatedSupabase } from '@/server/utils/supabase'

export default defineEventHandler(async event => {
	try {
		const { supabase, userId, handleSupabaseError } =
			await getAuthenticatedSupabase(event)

		const formData: any = await readMultipartFormData(event)

		if (!formData?.length) {
			return createError({ statusCode: 400, statusMessage: 'No file uploaded' })
		}

		const fileData = validateFileData(formData)
		if (!fileData) {
			return createError({
				statusCode: 400,
				statusMessage: 'Invalid file data',
			})
		}

		const uploadUserId = validateUserId(formData)
		if (!uploadUserId) {
			return createError({
				statusCode: 400,
				statusMessage: 'User ID is required',
			})
		}

		if (userId !== uploadUserId) {
			return createError({
				statusCode: 403,
				statusMessage: 'You can only upload images for your own profile',
			})
		}

		if (!validateFileType(fileData)) {
			return createError({
				statusCode: 400,
				statusMessage: 'Only image files are allowed',
			})
		}

		if (!validateFileSize(fileData)) {
			return createError({
				statusCode: 400,
				statusMessage: 'File size exceeds the 5MB limit',
			})
		}

		const uniqueFilename = generateUniqueFilename(userId, fileData.filename)

		// 1# Upload new image to storage
		const { data, error } = await uploadToStorage(
			supabase,
			uniqueFilename,
			fileData,
		)
		if (error) {
			return handleSupabaseError(error)
		}

		const publicUrl = getPublicUrl(supabase, uniqueFilename)

		// 2# Update profile in database
		const { error: updateError } = await supabase
			.from('profiles')
			.update({ img: publicUrl })
			.eq('user_id', userId)

		if (updateError) {
			return handleSupabaseError(updateError)
		}

		return {
			statusCode: 200,
			body: {
				path: data.path,
				publicUrl,
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

// Helper functions
function validateFileData(formData: any[]) {
	const fileData = formData.find(item => item.name === 'file')
	return fileData?.data && fileData?.filename ? fileData : null
}

function validateUserId(formData: any[]) {
	const userIdField = formData.find(item => item.name === 'user_id')
	return userIdField?.data
		? Buffer.from(userIdField.data).toString('utf-8')
		: null
}

function validateFileType(fileData: any) {
	const fileType = fileData.type || 'application/octet-stream'
	return fileType.startsWith('image/')
}

function validateFileSize(fileData: any) {
	const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
	return fileData.data.length <= MAX_FILE_SIZE
}

function generateUniqueFilename(userId: string, filename: string) {
	const fileExtension = filename.split('.').pop()
	return `${userId}/${Date.now()}.${fileExtension}`
}

async function uploadToStorage(
	supabase: any,
	uniqueFilename: string,
	fileData: any,
) {
	return supabase.storage
		.from('profile-images')
		.upload(uniqueFilename, fileData.data, {
			contentType: fileData.type || 'application/octet-stream',
			upsert: true,
		})
}

function getPublicUrl(supabase: any, uniqueFilename: string) {
	const { data } = supabase.storage
		.from('profile-images')
		.getPublicUrl(uniqueFilename)
	return data.publicUrl
}
