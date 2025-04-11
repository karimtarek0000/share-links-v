<script setup lang="ts">
import { validateSignup } from '@/validation/authSchema'

definePageMeta({
	layout: 'auth',
})

// Form state
const isSubmitting = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

// Form schema and state
const formState = reactive({
	name: '',
	email: '',
	password: '',
	confirmPassword: '',
})

// Use form validation composable
const { validateField, validateForm, getFieldError, isFormValid } =
	useFormValidation(formState, validateSignup)

// Field validation errors
const nameError = getFieldError('name')
const emailError = getFieldError('email')
const passwordError = getFieldError('password')
const confirmPasswordError = getFieldError('confirmPassword')

// Form submission
const handleSubmit = async (event: any) => {
	// Ensure validation is performed before proceeding
	if (!validateForm()) {
		event.preventDefault()
		return
	}

	isSubmitting.value = true
	try {
		// TODO: Implement actual registration logic
		console.log('Registration attempt:', {
			name: formState.name,
			email: formState.email,
			password: formState.password,
		})
		await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call

		// Redirect to home page after successful signup
		await navigateTo('/')
	} catch (error) {
		console.error('Registration error:', error)
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
			<div class="text-center mb-8">
				<h1
					class="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600"
				>
					Create Account
				</h1>
				<p class="text-gray-600 dark:text-gray-400 mt-2">
					Get started with your new profile
				</p>
			</div>

			<UForm :state="formState" @submit="handleSubmit" class="space-y-6">
				<!-- Name field -->
				<UFormField label="Full Name" name="name">
					<UInput
						class="w-full"
						v-model="formState.name"
						type="text"
						placeholder="John Doe"
						size="lg"
						autocomplete="off"
						:color="nameError ? 'error' : undefined"
						:status="formState.name && !nameError ? 'success' : undefined"
						@blur="validateField('name')"
						@update:model-value="validateField('name')"
					>
						<template #trailing>
							<UIcon
								v-if="formState.name"
								:name="
									!nameError
										? 'i-heroicons-check-circle'
										: 'i-heroicons-exclamation-circle'
								"
								class="h-5 w-5"
								:class="!nameError ? 'text-green-500' : 'text-red-500'"
							/>
						</template>
					</UInput>
					<template #error>
						<p v-if="nameError" class="text-red-500 text-sm animate-pulse">
							{{ nameError }}
						</p>
					</template>
				</UFormField>

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

				<!-- Password field -->
				<UFormField label="Password" name="password">
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
											showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'
										"
										class="h-5 w-5 text-gray-400 hover:text-gray-600"
									/>
								</button>
							</div>
						</template>
					</UInput>
					<template #error>
						<p v-if="passwordError" class="text-red-500 text-sm animate-pulse">
							{{ passwordError }}
						</p>
					</template>
				</UFormField>

				<!-- Confirm Password field -->
				<UFormField label="Confirm Password" name="confirmPassword">
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
					{{ isSubmitting ? 'Creating Account...' : 'Create Account' }}
				</UButton>
			</UForm>

			<!-- Login link -->
			<div class="text-center mt-6">
				<p class="text-gray-600 dark:text-gray-400">
					Already have an account?
					<NuxtLink
						to="/auth/login"
						class="font-medium text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 hover:brightness-110 transition-all"
					>
						Login
					</NuxtLink>
				</p>
			</div>
		</UCard>
	</div>
</template>
