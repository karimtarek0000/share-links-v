import { createClient } from '@supabase/supabase-js'
import { ref } from 'vue'

const user = ref<any>(null)

// Create a single supabase client for interacting with your database
export const useSupabase = () => {
	// Get runtime config to access environment variables
	const config = useRuntimeConfig()

	// Access Supabase credentials from runtime config (public section)
	const supabaseUrl = config.public.supabaseUrl
	const supabaseKey = config.public.supabaseKey

	if (!supabaseUrl || !supabaseKey) {
		throw createError({
			statusCode: 500,
			statusMessage: 'Supabase configuration is incomplete',
		})
	}

	const supabase = createClient(supabaseUrl, supabaseKey)
	const loading = ref(false)
	const error = ref(null)

	// Get current user from session
	const getCurrentUser = async () => {
		try {
			loading.value = true
			const { data, error: sessionError } = await supabase.auth.getSession()

			if (sessionError) {
				throw sessionError
			}

			if (data?.session?.user) {
				user.value = data.session
				return user.value
			} else {
				user.value = null
				return null
			}
		} catch (err: any) {
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
