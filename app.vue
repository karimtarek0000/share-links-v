<template>
	<UApp :toaster="{ position: 'top-right' }">
		<NuxtLayout>
			<NuxtRouteAnnouncer />
			<NuxtPage />
		</NuxtLayout>
	</UApp>
</template>
