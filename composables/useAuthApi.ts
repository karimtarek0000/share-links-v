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

	const confirmEmail = async () => {
		try {
			const data = await $fetch('/api/auth/confirm-email', {
				method: 'POST',
				body: {
					token_hash: window.location.hash,
					type: 'email_confirmation',
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

	const logout = async () => {
		try {
			const data = await $fetch('/api/auth/logout', {
				method: 'POST',
			})
			return data
		} catch (err: any) {
			console.error('Logout API error:', err)
		}
	}

	return {
		signup,
		confirmEmail,
		login,
		logout,
	}
}
