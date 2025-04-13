import { useAuthApi } from '@/composables/useAuthApi'
import { useSupabase } from '@/composables/useSupabase'
const { logout } = useAuthApi()

export default defineNuxtRouteMiddleware(async to => {
	const { user, getCurrentUser } = useSupabase()

	if (to.query.fromMail) {
		await logout()
		return
	}

	// Check if user is already authenticated
	if (!user.value) {
		await getCurrentUser()
	}

	// Check if this is an auth page (login, signup, etc.)
	const isAuthPage = to.path.startsWith('/auth/')

	// If user exists and is trying to access an auth page, redirect to home
	if (
		user.value &&
		typeof user.value === 'object' &&
		Object.keys(user.value).length > 0 &&
		isAuthPage
	) {
		return navigateTo('/')
	}

	// If user doesn't exist and trying to access a protected page, redirect to login
	if (
		(!user.value ||
			(typeof user.value === 'object' &&
				Object.keys(user.value).length === 0)) &&
		!isAuthPage
	) {
		return navigateTo('/auth/login')
	}

	return
})
