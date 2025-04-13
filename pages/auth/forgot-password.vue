<script setup lang="ts">
import { validateForgotPassword } from '@/validation/authSchema'

definePageMeta({
	layout: 'auth',
	middleware: 'auth',
})

// Form states
const isSubmitting = ref(false)
const emailSent = ref(false)
const sentToEmail = ref('')

// Form schema and state
const formState = reactive({
	email: '',
})

// Use validation composable
const { validateField, getFieldError, isFormValid } = useFormValidation(
	formState,
	validateForgotPassword,
)

// Get authApi composable
const { forgotPassword } = useAuthApi()
const toast = useToast()

// Field validation errors
const emailError = getFieldError('email')

// Form submission
const handleSubmit = async () => {
	isSubmitting.value = true

	try {
		await forgotPassword(formState.email)

		// Update UI to show success message
		emailSent.value = true
		sentToEmail.value = formState.email

		toast.add({
			title: 'Reset email sent!',
			description: 'Check your inbox for password reset instructions',
			color: 'success',
			icon: '',
		})
	} catch (error: any) {
		toast.add({
			title: error.message || 'Failed to send reset email',
			description: 'Please try again later',
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
			<div v-if="emailSent" class="text-center py-8">
				<UIcon
					name="i-heroicons-envelope-check"
					class="h-16 w-16 mx-auto text-green-500 mb-4"
				/>
				<h1 class="text-2xl font-bold mb-2">Check your email</h1>
				<p class="text-gray-600 dark:text-gray-400 mb-4">
					We've sent password reset instructions to:<br />
					<a
						class="font-semibold underline mt-2"
						:href="`mailto:${sentToEmail}`"
						>{{ sentToEmail }}</a
					>
				</p>
				<p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
					Follow the instructions in the email to reset your password.
				</p>
				<NuxtLink
					to="/auth/login"
					class="text-blue-600 font-medium hover:underline"
				>
					Return to login
				</NuxtLink>
			</div>

			<div v-else>
				<div class="text-center mb-8">
					<h1
						class="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600"
					>
						Reset Password
					</h1>
					<p class="text-gray-600 dark:text-gray-400 mt-2">
						Enter your email to receive reset instructions
					</p>
				</div>

				<UForm :state="formState" @submit="handleSubmit" class="space-y-6">
					<!-- Email field -->
					<UFormField label="Email" name="email">
						<UInput
							class="w-full"
							v-model="formState.email"
							type="email"
							placeholder="your@email.com"
							size="lg"
							autocomplete="off"
							:color="emailError ? 'error' : undefined"
							:status="formState.email && !emailError ? 'success' : undefined"
							@blur="validateField('email')"
							@update:model-value="validateField('email')"
						>
							<template #trailing>
								<UIcon
									v-if="formState.email"
									:name="
										!emailError
											? 'i-heroicons-check-circle'
											: 'i-heroicons-exclamation-circle'
									"
									class="h-5 w-5"
									:class="!emailError ? 'text-green-500' : 'text-red-500'"
								/>
							</template>
						</UInput>
						<template #error>
							<p v-if="emailError" class="text-red-500 text-sm animate-pulse">
								{{ emailError }}
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
						{{
							isSubmitting
								? 'Sending Instructions...'
								: 'Send Reset Instructions'
						}}
					</UButton>
				</UForm>

				<!-- Back to login link -->
				<div class="text-center mt-6">
					<p class="text-gray-600 dark:text-gray-400">
						Remember your password?
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
