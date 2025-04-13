<script setup lang="ts">
import { validateResetPassword } from '@/validation/authSchema'
import { useSupabase } from '~/composables/useSupabase'

// Don't use auth middleware for this page
definePageMeta({
	layout: 'auth',
	middleware: 'auth',
})

// Form state
const isSubmitting = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const resetComplete = ref(false)
const toast = useToast()

// Form schema and state
const formState = reactive({
	password: '',
	confirmPassword: '',
})

// Use validation composable
const { validateField, getFieldError, isFormValid } = useFormValidation(
	formState,
	validateResetPassword,
)

// Field validation errors
const passwordError = getFieldError('password')
const confirmPasswordError = getFieldError('confirmPassword')

// Get Supabase client
const { supabase } = useSupabase()

// Form submission
const handleSubmit = async () => {
	isSubmitting.value = true

	try {
		// Update user's password
		const { error } = await supabase.auth.updateUser({
			password: formState.password,
		})

		if (error) {
			toast.add({
				title: error.message || 'Failed to update password',
				description: 'Failed to update password',
				color: 'error',
				icon: 'i-heroicons-exclamation-circle',
			})
		}

		// Show success message
		resetComplete.value = true

		toast.add({
			title: 'Password updated successfully!',
			description: 'You can now log in with your new password',
			color: 'success',
			icon: 'i-heroicons-check-circle',
		})
	} catch (error: any) {
		toast.add({
			title: error.message || 'Failed to reset password',
			description: 'Please try again later or request a new reset link',
			color: 'error',
			icon: 'i-heroicons-exclamation-circle',
		})
	} finally {
		isSubmitting.value = false
	}
}
</script>

<template>
	<div class="relative w-full max-w-md">
		<!-- Background gradient effect with blur -->
		<div
			class="absolute inset-0 rounded-xl blur-xl bg-gradient-to-r from-purple-500/20 to-blue-500/20"
		></div>

		<!-- Decorative elements -->
		<div
			class="absolute top-4 left-10 w-20 h-20 rounded-full blur-md bg-blue-300/20"
		></div>
		<div
			class="absolute bottom-6 right-10 w-16 h-16 rounded-full blur-md bg-purple-300/20"
		></div>

		<!-- Content -->
		<UCard
			class="relative z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-100 dark:border-gray-800"
		>
			<div v-if="resetComplete" class="text-center py-8">
				<UIcon
					name="i-heroicons-check-circle"
					class="h-16 w-16 mx-auto text-green-500 mb-4"
				/>
				<h1 class="text-2xl font-bold mb-2">Password Reset Complete</h1>
				<p class="text-gray-600 dark:text-gray-400 mb-4">
					Your password has been successfully updated.
				</p>
				<p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
					Redirecting you to the login page...
				</p>
				<NuxtLink
					to="/auth/login"
					class="text-blue-600 font-medium hover:underline"
				>
					Go to Login
				</NuxtLink>
			</div>

			<div v-else>
				<div class="text-center mb-8">
					<h1
						class="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600"
					>
						Reset Your Password
					</h1>
					<p class="text-gray-600 dark:text-gray-400 mt-2">
						Enter your new password below
					</p>
				</div>

				<UForm :state="formState" @submit="handleSubmit" class="space-y-6">
					<!-- Password field -->
					<UFormField label="New Password" name="password">
						<UInput
							class="w-full"
							v-model="formState.password"
							:type="showPassword ? 'text' : 'password'"
							placeholder="••••••••"
							size="lg"
							autocomplete="off"
							:color="passwordError ? 'error' : undefined"
							:status="
								formState.password && !passwordError ? 'success' : undefined
							"
							@blur="validateField('password')"
							@update:model-value="validateField('password')"
						>
							<template #trailing>
								<div class="flex items-center space-x-2">
									<UIcon
										v-if="formState.password"
										:name="
											!passwordError
												? 'i-heroicons-check-circle'
												: 'i-heroicons-exclamation-circle'
										"
										class="h-5 w-5"
										:class="!passwordError ? 'text-green-500' : 'text-red-500'"
									/>
									<button
										type="button"
										class="focus:outline-none flex"
										@click="showPassword = !showPassword"
									>
										<UIcon
											:name="
												showPassword
													? 'i-heroicons-eye-slash'
													: 'i-heroicons-eye'
											"
											class="h-5 w-5 text-gray-400 hover:text-gray-600"
										/>
									</button>
								</div>
							</template>
						</UInput>
						<template #error>
							<p
								v-if="passwordError"
								class="text-red-500 text-sm animate-pulse"
							>
								{{ passwordError }}
							</p>
						</template>
					</UFormField>

					<!-- Confirm Password field -->
					<UFormField label="Confirm New Password" name="confirmPassword">
						<UInput
							class="w-full"
							v-model="formState.confirmPassword"
							:type="showConfirmPassword ? 'text' : 'password'"
							placeholder="••••••••"
							size="lg"
							autocomplete="off"
							:color="confirmPasswordError ? 'error' : undefined"
							:status="
								formState.confirmPassword && !confirmPasswordError
									? 'success'
									: undefined
							"
							@blur="validateField('confirmPassword')"
							@update:model-value="validateField('confirmPassword')"
						>
							<template #trailing>
								<div class="flex items-center space-x-2">
									<UIcon
										v-if="formState.confirmPassword"
										:name="
											!confirmPasswordError
												? 'i-heroicons-check-circle'
												: 'i-heroicons-exclamation-circle'
										"
										class="h-5 w-5"
										:class="
											!confirmPasswordError ? 'text-green-500' : 'text-red-500'
										"
									/>
									<button
										type="button"
										class="focus:outline-none flex"
										@click="showConfirmPassword = !showConfirmPassword"
									>
										<UIcon
											:name="
												showConfirmPassword
													? 'i-heroicons-eye-slash'
													: 'i-heroicons-eye'
											"
											class="h-5 w-5 text-gray-400 hover:text-gray-600"
										/>
									</button>
								</div>
							</template>
						</UInput>
						<template #error>
							<p
								v-if="confirmPasswordError"
								class="text-red-500 text-sm animate-pulse"
							>
								{{ confirmPasswordError }}
							</p>
						</template>
					</UFormField>

					<!-- Submit button -->
					<UButton
						type="submit"
						block
						size="lg"
						:loading="isSubmitting"
						:disabled="!isFormValid || isSubmitting"
						class="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
					>
						{{ isSubmitting ? 'Updating Password...' : 'Reset Password' }}
					</UButton>
				</UForm>

				<!-- Back to login link -->
				<div class="text-center mt-6">
					<p class="text-gray-600 dark:text-gray-400">
						<NuxtLink
							to="/auth/login"
							class="font-medium text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 hover:brightness-110 transition-all"
						>
							Back to Login
						</NuxtLink>
					</p>
				</div>
			</div>
		</UCard>
	</div>
</template>
