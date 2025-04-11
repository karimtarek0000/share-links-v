<script setup lang="ts">
const profileFormRef = useTemplateRef('profileForm')
</script>

<template>
	<UContainer class="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
		<div class="max-w-6xl mx-auto">
			<AppHeader />

			<!-- Main layout container -->
			<div class="flex flex-col md:flex-row gap-8 md:gap-12">
				<!-- Preview Section (Left on desktop, Top on mobile) -->
				<div class="w-full md:w-2/5 flex justify-center">
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
				<div class="w-full md:w-3/5">
					<ProfileForm ref="profileForm" />
				</div>
			</div>
		</div>
	</UContainer>
</template>
