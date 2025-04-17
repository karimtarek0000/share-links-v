<template>
	<UContainer class="min-h-screen flex flex-col items-center justify-center">
		<AppHeader :hide="true" class="w-full" />
		<slot />
	</UContainer>
</template>
