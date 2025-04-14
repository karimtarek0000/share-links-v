import { z } from 'zod'

// Define login validation schema
export const loginSchema = z.object({
	email: z
		.string()
		.min(1, 'Email is required')
		.email('Please enter a valid email address'),
	password: z
		.string()
		.min(1, 'Password is required')
		.min(8, 'Password must be at least 8 characters'),
})

// Define signup validation schema with additional fields
export const signupSchema = z
	.object({
		name: z
			.string()
			.min(1, 'Name is required')
			.min(3, 'Name must be at least 3 characters'),
		email: z
			.string()
			.min(1, 'Email is required')
			.email('Please enter a valid email address'),
		password: z
			.string()
			.min(1, 'Password is required')
			.min(8, 'Password must be at least 8 characters')
			.regex(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
				'Password must include uppercase, lowercase, number and special character',
			),
		confirmPassword: z.string().min(1, 'Please confirm your password'),
	})
	.refine(data => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword'],
	})

// Define forgot password validation schema
export const forgotPasswordSchema = z.object({
	email: z
		.string()
		.min(1, 'Email is required')
		.email('Please enter a valid email address'),
})

// Define reset password validation schema
export const resetPasswordSchema = z
	.object({
		password: z
			.string()
			.min(1, 'Password is required')
			.min(8, 'Password must be at least 8 characters')
			.regex(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
				'Password must include uppercase, lowercase, number and special character',
			),
		confirmPassword: z.string().min(1, 'Please confirm your password'),
	})
	.refine(data => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword'],
	})

// Type for validation errors
export type ValidationError = {
	name: string
	message: string
}

// Define validation function for login form
export const validateLogin = (
	state: z.infer<typeof loginSchema>,
): ValidationError[] => {
	const errors: ValidationError[] = []

	const result = loginSchema.safeParse(state)

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

// Define validation function for signup form
export const validateSignup = (
	state: z.infer<typeof signupSchema>,
): ValidationError[] => {
	const errors: ValidationError[] = []

	const result = signupSchema.safeParse(state)

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

// Define validation function for forgot password form
export const validateForgotPassword = (
	state: z.infer<typeof forgotPasswordSchema>,
): ValidationError[] => {
	const errors: ValidationError[] = []

	const result = forgotPasswordSchema.safeParse(state)

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

// Define validation function for reset password form
export const validateResetPassword = (
	state: z.infer<typeof resetPasswordSchema>,
): ValidationError[] => {
	const errors: ValidationError[] = []

	const result = resetPasswordSchema.safeParse(state)

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
