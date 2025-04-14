import {
	createError,
	defineEventHandler,
	getRequestHeader,
	getRequestURL,
} from 'h3'

/**
 * Server middleware to handle authentication for profile API routes
 * This middleware extracts the token from headers and makes it available in the event context
 */
export default defineEventHandler(async event => {
	// Get the current request path
	const path = getRequestURL(event).pathname

	// Only apply middleware to profile API routes
	if (!path.startsWith('/api/profile/')) {
		return
	}

	// Extract the authorization token from headers
	const authHeader = getRequestHeader(event, 'authorization')
	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return createError({
			statusCode: 401,
			statusMessage: 'Unauthorized: Missing or invalid authentication token',
		})
	}

	// Store the token in event context for easy access in API handlers
	const token = authHeader.split(' ')[1]
	event.context.supabaseToken = token
})
