import { signupSchema } from '@/validation/authSchema'
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async event => {
	try {
		// Get request body
		const body = await readBody(event)
		const { name, email, password } = body

		// Validate request body
		const result = signupSchema.safeParse({
			name,
			email,
			password,
			confirmPassword: password,
		})
		if (!result.success) {
			return {
				statusCode: 400,
				body: { error: result.error.format() },
			}
		}

		// Get runtime config to access environment variables
		const config = useRuntimeConfig()

		// Access Supabase credentials from runtime config
		const supabaseUrl = config.public.supabaseUrl
		const supabaseKey = config.public.supabaseKey

		if (!supabaseUrl || !supabaseKey) {
			throw new Error('Supabase configuration is missing')
		}

		const supabase = createClient(supabaseUrl, supabaseKey)

		// Sign up
		const { data, error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: { name },
			},
		})

		if (error) {
			return createError({
				statusCode: error.status,
				message: error.message,
			})
		}

		// Return user data and session
		return {
			statusCode: 200,
			body: {
				user: data.user,
				session: data.session,
				message: 'User created successfully',
			},
		}
	} catch (error: any) {
		return createError({
			statusCode: error.status,
			message: error.message,
		})
	}
})
