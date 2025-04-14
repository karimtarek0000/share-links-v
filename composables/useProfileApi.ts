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
	const addProfile = async (profileData: ProfileTable) => {
		try {
			const data: ApiResponse = await $fetch('/api/profile/add', {
				method: 'POST',
				body: profileData,
			})

			return data
		} catch (err: any) {
			return Promise.reject(err.response._data)
		}
	}

	const getProfile = async (user_id: string) => {
		try {
			const data: ApiResponse = await $fetch(`/api/profile/get`, {
				method: 'GET',
				params: {
					user_id,
				},
			})

			return data
		} catch (err: any) {
			return Promise.reject(err.response._data)
		}
	}

	const updateProfile = async (profileData: ProfileTable) => {
		try {
			const data: ApiResponse = await $fetch('/api/profile/update', {
				method: 'PUT',
				body: profileData,
			})

			return data
		} catch (err: any) {
			return Promise.reject(err.response._data)
		}
	}

	const uploadProfileImage = async (file: File, user_id: string) => {
		try {
			// Create a FormData object to send the file
			const formData = new FormData()
			formData.append('file', file)
			formData.append('user_id', user_id)

			const data: ApiResponse = await $fetch('/api/profile/upload-image', {
				method: 'POST',
				body: formData,
			})

			return data
		} catch (err: any) {
			return Promise.reject(err.response._data)
		}
	}

	const deleteProfileImage = async (user_id: string, imagePath: string) => {
		try {
			const data: ApiResponse = await $fetch('/api/profile/delete-image', {
				method: 'DELETE',
				body: {
					user_id,
					imagePath,
				},
			})

			return data
		} catch (err: any) {
			return Promise.reject(err.response._data)
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
