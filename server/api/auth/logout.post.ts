import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async event => {
	try {
		// Get runtime config to access environment variables
		const config = useRuntimeConfig()

		// Access Supabase credentials from runtime config
		const supabaseUrl = config.public.supabaseUrl
		const supabaseKey = config.public.supabaseKey

		if (!supabaseUrl || !supabaseKey) {
			throw new Error('Supabase configuration is missing')
		}

		const supabase = createClient(supabaseUrl, supabaseKey)

		// Sign out the user
		const { error } = await supabase.auth.signOut()

		if (error) {
			return createError({
				statusCode: error.status,
				message: error.message,
			})
		}

		// Return success message
		return {
			statusCode: 200,
			body: { message: 'Successfully logged out' },
		}
	} catch (error: any) {
		return createError({
			statusCode: error.status,
			message: error.message,
		})
	}
})
