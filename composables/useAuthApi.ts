interface Data {
	body: {
		error?: { message: string }
		message?: string
	}
	error: boolean
	statusCode: number
}

export const useAuthApi = () => {
	const signup = async (email: string, password: string, name: string) => {
		try {
			const data: Data = await $fetch('/api/auth/signup', {
				method: 'POST',
				body: {
					email,
					password,
					name,
				},
			})

			return data
		} catch (err: any) {
			return Promise.reject(err.response._data)
		}
	}

	const login = async (email: string, password: string) => {
		try {
			const data = await $fetch('/api/auth/login', {
				method: 'POST',
				body: {
					email,
					password,
				},
			})

			return data
		} catch (err: any) {
			return Promise.reject(err.response._data)
		}
	}

	const forgotPassword = async (email: string) => {
		try {
			const data = await $fetch('/api/auth/forgot-password', {
				method: 'POST',
				body: {
					email,
				},
			})

			return data
		} catch (err: any) {
			return Promise.reject(err.response._data)
		}
	}

	const logout = async () => {
		try {
			const data = await $fetch('/api/auth/logout', {
				method: 'POST',
			})

			localStorage.removeItem('sb-jimcygitqskqhzefxgaw-auth-token')

			return data
		} catch (err: any) {
			return Promise.reject(err.response._data)
		}
	}

	return {
		signup,
		login,
		logout,
		forgotPassword,
	}
}
