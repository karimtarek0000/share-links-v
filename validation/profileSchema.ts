import { z } from 'zod'

// Define the profile validation schema with Zod
export const profileSchema = z.object({
	name: z
		.string()
		.min(1, 'Name is required')
		.min(5, 'Name must be at least 5 characters'),
	bio: z
		.string()
		.min(1, 'Bio is required')
		.min(10, 'Bio must be at least 10 characters')
		.max(150, 'Bio must be 150 characters or less'),
	profileImage: z.string().nullable(),
	socials: z
		.array(
			z.object({
				platform: z.string(),
				url: z.string().refine(url => {
					if (!url.trim()) return true // Allow empty URLs
					try {
						const urlToCheck =
							!url.startsWith('http://') && !url.startsWith('https://')
								? 'https://' + url
								: url
						const urlObj = new URL(urlToCheck)
						return urlObj.hostname.includes('.') && urlObj.hostname.length > 3
					} catch {
						return false
					}
				}, 'Please enter a valid URL'),
				icon: z.string(),
			}),
		)
		.min(1, 'At least one social link is required'),
})

// Type for validation errors
export type ValidationError = {
	name: string
	message: string
}

// Define validation function for use with Nuxt UI forms
export const validateProfile = (state: any): ValidationError[] => {
	const errors: ValidationError[] = []

	try {
		profileSchema.parse(state)
	} catch (e: any) {
		if (e.errors) {
			e.errors.forEach((err: any) => {
				const path = err.path.join('.')
				errors.push({
					name: path,
					message: err.message,
				})
			})
		}
	}

	return errors
}
