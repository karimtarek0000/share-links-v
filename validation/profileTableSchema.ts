import { z } from 'zod'

// Define the profile table schema with Zod
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

// Helper functions for validation
export const validateProfileData = (
	data: z.infer<typeof profileTableSchema>,
): { success: boolean; error?: any } => {
	const result = profileTableSchema.safeParse(data)

	if (!result.success) {
		return {
			success: false,
			error: result.error.format(),
		}
	}

	return { success: true }
}
