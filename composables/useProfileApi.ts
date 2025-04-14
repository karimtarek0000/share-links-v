import { type ProfileTable } from '@/validation/profileTableSchema'

interface ApiResponse {
	statusCode: number
	body:
		| {
				error?: { message: string }
				message?: string
		  }
		| ProfileTable
		| { path: string; publicUrl: string }
}

export const useProfileApi = () => {
	const { supabase } = useSupabase()

	// Helper to get the authentication headers
	const getAuthHeaders = async () => {
		const { data } = await supabase.auth.getSession()

		if (!data.session?.access_token) {
			throw createError({
				statusCode: 401,
				message: 'User not authenticated',
				name: 'AuthenticationError',
			})
		}

		return {
			Authorization: `Bearer ${data.session.access_token}`,
		}
	}

	const addProfile = async (profileData: ProfileTable) => {
		try {
			// Get auth headers
			const headers = await getAuthHeaders()

			const data: ApiResponse = await $fetch('/api/profile/add', {
				method: 'POST',
				body: profileData,
				headers,
			})

			return data
		} catch (err: any) {
			return Promise.reject(err.response?._data || err)
		}
	}

	const getProfile = async (user_id: string) => {
		try {
			// Get auth headers
			const headers = await getAuthHeaders()

			const data: ApiResponse = await $fetch(`/api/profile/get`, {
				method: 'GET',
				params: {
					user_id,
				},
				headers,
			})

			return data
		} catch (err: any) {
			return Promise.reject(err.response?._data || err)
		}
	}

	const updateProfile = async (profileData: ProfileTable) => {
		try {
			// Get auth headers
			const headers = await getAuthHeaders()

			const data: ApiResponse = await $fetch('/api/profile/update', {
				method: 'PUT',
				body: profileData,
				headers,
			})

			return data
		} catch (err: any) {
			return Promise.reject(err.response?._data || err)
		}
	}

	const uploadProfileImage = async (file: File, user_id: string) => {
		try {
			// Get auth headers
			const headers = await getAuthHeaders()

			// Create a FormData object to send the file
			const formData = new FormData()
			formData.append('file', file)
			formData.append('user_id', user_id)

			const data: ApiResponse = await $fetch('/api/profile/upload-image', {
				method: 'POST',
				body: formData,
				headers,
			})

			return data
		} catch (err: any) {
			return Promise.reject(err.response?._data || err)
		}
	}

	const deleteProfileImage = async (user_id: string, imagePath: string) => {
		try {
			// Get auth headers
			const headers = await getAuthHeaders()

			const data: ApiResponse = await $fetch('/api/profile/delete-image', {
				method: 'DELETE',
				body: {
					user_id,
					imagePath,
				},
				headers,
			})

			return data
		} catch (err: any) {
			return Promise.reject(err.response?._data || err)
		}
	}

	return {
		addProfile,
		getProfile,
		updateProfile,
		uploadProfileImage,
		deleteProfileImage,
	}
}
