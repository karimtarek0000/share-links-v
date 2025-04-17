<script setup lang="ts">
definePageMeta({
	layout: 'preview',
})

const { getProfile } = useProfileApi()
const { detectPlatform } = useSocialPlatforms()
const toast = useToast()
const { params } = useRoute()

// Create reactive form state
const userData = reactive<UserData>({
	name: '',
	bio: '',
	profileImage: null,
	socials: [],
})

// This for make sure data will getting after redirect to the page
await useAsyncData(async () => {
	try {
		const { body } = await getProfile(params.userid as string)
		userData.name = body.name || ''
		userData.bio = body.bio || ''
		userData.profileImage = body.img || null
		userData.socials = body.social_links.map((link: string) => ({
			platform: detectPlatform(link).platform,
			url: link,
			icon: detectPlatform(link).icon,
		}))
	} catch (error: any) {
		toast.add({
			title: error.message || 'Error fetching profile data',
			description: 'Failed to retrieve your profile data',
			color: 'error',
			icon: 'i-mdi-alert',
		})
	}
})
</script>

<template>
	<ProfilePreview :userData="userData" />
</template>
