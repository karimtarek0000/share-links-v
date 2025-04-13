import { createClient } from '@supabase/supabase-js'
import { ref } from 'vue'

// Create a single supabase client for interacting with your database
export const useSupabase = () => {
	// Get runtime config to access environment variables
	const config = useRuntimeConfig()

	// Access Supabase credentials from runtime config (public section)
	const supabaseUrl = config.public.supabaseUrl
	const supabaseKey = config.public.supabaseKey

	if (!supabaseUrl || !supabaseKey) {
		console.error('Supabase URL or Key is missing')
		throw new Error('Supabase configuration is incomplete')
	}

	const supabase = createClient(supabaseUrl, supabaseKey)
	const user = ref(null)
	const loading = ref(false)
	const error = ref(null)

	// Get current user from session
	const getCurrentUser = async () => {
		try {
			loading.value = true
			const { data, error: sessionError } = await supabase.auth.getSession()

			if (sessionError) {
				console.error('Session error:', sessionError)
				throw sessionError
			}

			if (data?.session?.user) {
				user.value = data.session.user
				return user.value
			} else {
				user.value = null
				return null
			}
		} catch (err) {
			console.error('Error getting user session:', err)
			error.value = err.message || 'Failed to get current user'
			user.value = null
			return null
		} finally {
			loading.value = false
		}
	}

	return {
		supabase,
		user,
		loading,
		error,
		getCurrentUser,
	}
}
