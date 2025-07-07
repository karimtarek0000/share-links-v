<script setup lang="ts">
definePageMeta({
  layout: 'preview',
})

const { getProfile } = useProfileApi()
const { detectPlatform } = useSocialPlatforms()
const toast = useToast()
const { params } = useRoute()

// This for make sure data will getting after redirect to the page
const { data: userData } = await useAsyncData('profileData', async () => {
  try {
    const { body } = await getProfile(params.userid as string)
    const userData = {
      name: body.name || '',
      bio: body.bio || '',
      profileImage: body.img || null,
      socials: body.social_links?.map((link: string) => {
        const { platform, icon } = detectPlatform(link)
        return { platform, url: link, icon }
      }),
    }

    return userData as UserData
  } catch (error: any) {
    toast.add({
      title: error.message || 'Error fetching profile data',
      description: 'Failed to retrieve your profile data',
      color: 'error',
      icon: 'i-mdi-alert',
    })
    navigateTo('/auth/login')
  }
})

useSeoMeta({
  title: () => userData.value?.name,
  ogTitle: () => userData.value?.name,
  ogDescription: () => userData.value?.bio,
  ogImage: () => userData.value?.profileImage,
})
</script>

<template>
  <ProfilePreview :userData="userData!" />
</template>
