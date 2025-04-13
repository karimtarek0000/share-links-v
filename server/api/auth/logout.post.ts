import { useServerSupabase } from '~/composables/useServerSupabase'

export default defineEventHandler(async event => {
	try {
		// Use the server Supabase composable
		const { getSupabaseClient, handleSupabaseError } = useServerSupabase()
		const supabase = getSupabaseClient()

		// Sign out the user
		const { error } = await supabase.auth.signOut()

		if (error) {
			return handleSupabaseError(error)
		}

		// Return success message
		return {
			statusCode: 200,
			body: { message: 'Successfully logged out' },
		}
	} catch (error: any) {
		return createError({
			statusCode: error.status || 500,
			message: error.message || 'An error occurred during logout',
		})
	}
})
