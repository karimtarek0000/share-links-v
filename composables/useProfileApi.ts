import { type ProfileTable } from '@/validation/profileTableSchema'

interface ApiResponse {
	statusCode: number
	body:
		| {
				error?: { message: string }
				message?: string
		  }
		| ProfileTable
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

	const getProfile = async (userId: string) => {
		try {
			const data: ApiResponse = await $fetch(`/api/profile/get`, {
				method: 'GET',
				params: {
					userId,
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

	return {
		addProfile,
		getProfile,
		updateProfile,
	}
}
