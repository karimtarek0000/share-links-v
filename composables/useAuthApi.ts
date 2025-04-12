export const useAuthApi = () => {
	const config = useRuntimeConfig()

	const signup = async (email: string, password: string, name: string) => {
		try {
			const { data, error } = await useFetch('/api/auth/signup', {
				method: 'POST',
				body: {
					email,
					password,
					name,
				},
			})

			if (error.value) {
				throw new Error(error.value.message || 'Failed to sign up')
			}

			return data.value
		} catch (err: any) {
			console.error('Signup API error:', err)
			return { error: err.message || 'Failed to sign up' }
		}
	}

	const login = async (email: string, password: string) => {
		try {
			const { data, error } = await useFetch('/api/auth/login', {
				method: 'POST',
				body: {
					email,
					password,
				},
			})

			if (error.value) {
				throw new Error(error.value.message || 'Failed to log in')
			}

			return data.value
		} catch (err: any) {
			console.error('Login API error:', err)
			return { error: err.message || 'Failed to log in' }
		}
	}

	const logout = async () => {
		try {
			const { data, error } = await useFetch('/api/auth/logout', {
				method: 'POST',
			})

			if (error.value) {
				throw new Error(error.value.message || 'Failed to log out')
			}

			return data.value
		} catch (err: any) {
			console.error('Logout API error:', err)
			return { error: err.message || 'Failed to log out' }
		}
	}

	return {
		signup,
		login,
		logout,
	}
}
