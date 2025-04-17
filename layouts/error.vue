<template>
	<UContainer class="h-screen flex flex-col items-center justify-center">
		<div class="w-full py-6">
			<AppHeader :hide="true" />
		</div>

		<div class="w-full flex flex-col items-center justify-center">
			<slot />
		</div>

		<p class="w-full py-4 text-center text-gray-400 text-sm">
			&copy; {{ new Date().getFullYear() }} Share Linkes. All rights reserved.
		</p>
	</UContainer>
</template>
