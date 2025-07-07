<script setup lang="ts">
const profileFormRef = useTemplateRef('profileForm')

definePageMeta({
  middleware: 'auth',
})

useSeoMeta({
  title: 'Dashboard',
})
</script>

<template>
  <div class="max-w-6xl mx-auto">
    <!-- Main layout container -->
    <div class="flex flex-col md:flex-row gap-8 md:gap-12">
      <!-- Preview Section (Left on desktop, Top on mobile) -->
      <div
        class="w-full md:w-2/5 flex justify-center sticky max-sm:top-[300px]"
      >
        <ProfilePreview
          :userData="
            profileFormRef?.userData || {
              name: '',
              bio: '',
              profileImage: null,
              socials: [],
            }
          "
        />
      </div>

      <!-- Form Section (Right on desktop, Bottom on mobile) -->
      <div class="w-full md:w-3/5 z-20">
        <ProfileForm
          ref="profileForm"
          class="max-h-[78vh] py-2 px-1 overflow-auto custom-scrollbar"
        />
      </div>
    </div>
  </div>
</template>

<style></style>
