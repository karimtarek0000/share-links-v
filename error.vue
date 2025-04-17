<script setup lang="ts">
const error = useError()
const router = useRouter()

// Add null checking for error
const errorStatus = computed(() => error.value?.statusCode || 500)
const errorMessage = computed(() => error.value?.message || '')

const handleBack = () => router.back()
</script>

<template>
	<NuxtLayout name="error">
		<div
			class="flex flex-col items-center justify-center py-16 px-4 text-center"
		>
			<!-- Error icon -->
			<div class="mb-8 w-64 h-64">
				<svg
					viewBox="0 0 200 200"
					xmlns="http://www.w3.org/2000/svg"
					class="w-full h-full"
				>
					<!-- Background circle -->
					<circle cx="100" cy="100" r="95" fill="#EFF6FF" />

					<!-- 404 text -->
					<text
						x="100"
						y="115"
						font-family="sans-serif"
						font-size="42"
						font-weight="bold"
						text-anchor="middle"
						fill="#3B82F6"
					>
						404
					</text>

					<!-- Decorative elements -->
					<circle cx="65" cy="75" r="8" fill="#93C5FD" />
					<circle cx="135" cy="75" r="8" fill="#93C5FD" />
					<path
						d="M65,130 Q100,160 135,130"
						fill="none"
						stroke="#3B82F6"
						stroke-width="4"
						stroke-linecap="round"
					/>

					<!-- Orbiting circles animation -->
					<circle cx="100" cy="30" r="5" fill="#60A5FA">
						<animateTransform
							attributeName="transform"
							type="rotate"
							from="0 100 100"
							to="360 100 100"
							dur="8s"
							repeatCount="indefinite"
						/>
					</circle>
					<circle cx="170" cy="100" r="4" fill="#60A5FA">
						<animateTransform
							attributeName="transform"
							type="rotate"
							from="0 100 100"
							to="360 100 100"
							dur="6s"
							repeatCount="indefinite"
						/>
					</circle>
				</svg>
			</div>
			<h1 class="text-4xl font-bold mb-2">
				{{ errorStatus === 404 ? 'Page not found' : 'Something went wrong' }}
			</h1>
			<p class="text-gray-500 mb-8 max-w-md">
				{{
					errorMessage ||
					(errorStatus === 404
						? "The page you are looking for doesn't exist or has been moved."
						: "We're sorry, but something went wrong on our end. Please try again later.")
				}}
			</p>
			<div class="flex gap-4">
				<UButton
					color="success"
					icon="i-heroicons-arrow-left"
					@click="handleBack"
				>
					Go Back
				</UButton>
				<UButton color="primary" icon="i-heroicons-home" to="/">
					Return Home
				</UButton>
			</div>
		</div>
	</NuxtLayout>
</template>
