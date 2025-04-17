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
				url: z
					.string()
					.trim()
					.refine(
						url => {
							if (!url) return false // No longer allow empty URLs

							// Updated regex to accept paths after domain (e.g., /WatchiTMENA/)
							const regex =
								/^https?:\/\/www\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{2,62})+(\/.*)*/
							return regex.test(url)
						},
						{
							message:
								'URL must be like (e.g., https://www.facebook.com/username)',
						},
					),
				icon: z.string(),
			}),
		)
		.min(1, 'At least one social link is required')
		.refine(links => links.some(link => link.url && link.url.trim() !== ''), {
			message: 'At least one social link must have a valid URL',
			path: ['socials'],
		}),
})

export const profileTableSchema = z.object({
	user_id: z.string().min(1, 'User ID is required'),
	name: z.string().min(5, 'Name must be at least 5 characters'),
	bio: z
		.string()
		.min(10, 'Bio must be at least 10 characters')
		.max(150, 'Bio must be 150 characters or less'),
	img: z.string().nullable(),
	social_links: z.array(z.string()),
})

// Type for Supabase profiles table
export type ProfileTable = z.infer<typeof profileTableSchema>

// Type for validation errors
export type ValidationError = {
	name: string
	message: string
}

// Define validation function for use with Nuxt UI forms
export const validateProfile = (state: any): ValidationError[] => {
	const errors: ValidationError[] = []

	const result = profileSchema.safeParse(state)

	if (!result.success) {
		result.error.errors.forEach(err => {
			const path = err.path.join('.')
			errors.push({
				name: path,
				message: err.message,
			})
		})
	}

	return errors
}
