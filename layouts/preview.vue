<template>
	<UContainer class="min-h-screen flex flex-col items-center justify-center">
		<AppHeader :hide="true" class="w-full mb-10" />
		<slot />
		<div class="text-center mt-20">
			<p class="text-gray-600 dark:text-gray-400">
				Don't have an account?
				<NuxtLink
					to="/auth/signup"
					class="font-medium text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 hover:brightness-110 transition-all"
				>
					Create Account
				</NuxtLink>
				or
				<NuxtLink
					to="/auth/login"
					class="font-medium text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 hover:brightness-110 transition-all"
				>
					Login
				</NuxtLink>
			</p>
		</div>
	</UContainer>
</template>
