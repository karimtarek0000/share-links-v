<script setup lang="ts">
defineProps<{
	userData: {
		name: string
		bio: string
		profileImage: string | null
		socials: Array<{
			platform: string | PlatformKey
			url: string
			icon: string
		}>
	}
}>()

const { getPlatformColor } = useSocialPlatforms()
</script>

<template>
	<div class="relative">
		<!-- Mobile device mockup with modern design -->
		<div
			class="w-64 h-[520px] bg-gradient-to-br from-gray-900 to-gray-800 rounded-[40px] p-3 shadow-xl relative overflow-hidden"
		>
			<!-- Notch design -->
			<div
				class="absolute top-0 left-1/2 transform -translate-x-1/2 w-36 h-6 bg-black rounded-b-xl"
			></div>

			<div
				class="h-full w-full bg-white rounded-[36px] overflow-hidden flex flex-col"
			>
				<!-- Phone status bar -->
				<div class="bg-gray-100 px-4 py-2 flex justify-between items-center">
					<span class="text-xs font-medium">9:41</span>
					<div class="flex space-x-1.5">
						<UIcon name="i-mdi-signal" class="text-sm" />
						<UIcon name="i-mdi-wifi" class="text-sm" />
						<UIcon name="i-mdi-battery" class="text-sm" />
					</div>
				</div>

				<!-- Phone content -->
				<div class="flex-1 overflow-y-auto bg-gray-50">
					<div class="flex flex-col items-center p-5">
						<!-- Profile Image Preview -->
						<div
							class="mt-6 w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center shadow-md border-2 border-primary"
						>
							<img
								v-if="userData.profileImage"
								:src="userData.profileImage"
								class="w-full h-full object-cover"
								alt="Profile"
							/>
							<UIcon
								v-else
								name="i-mdi-account"
								class="text-gray-400 text-4xl"
							/>
						</div>

						<!-- Name Preview -->
						<h2 class="text-xl font-bold mt-4 text-center">
							{{ userData.name || 'Your Name' }}
						</h2>

						<!-- Bio Preview -->
						<p class="text-sm text-gray-600 mt-2 text-center max-w-[200px]">
							{{ userData.bio || 'Your short bio will appear here' }}
						</p>

						<!-- Social Links Preview -->
						<div class="w-full mt-6 space-y-3 px-2">
							<UTooltip
								v-for="(social, index) in userData.socials"
								:key="index"
								text="Click to visit"
							>
								<a
									href="#"
									class="block w-full rounded-lg shadow-sm p-3.5 flex items-center justify-center gap-2.5 transition-all duration-200"
									:class="[
										getPlatformColor(social.platform, 'bg'),
										getPlatformColor(social.platform, 'text'),
										getPlatformColor(social.platform, 'hover'),
									]"
								>
									<UIcon :name="social.icon" class="text-xl" />
									<span class="text-sm font-medium">
										{{
											social.platform
												? social.platform === 'other'
													? 'Link'
													: social.platform
												: 'New Link'
										}}
									</span>
								</a>
							</UTooltip>

							<p
								v-if="!userData.socials.length"
								class="text-center text-gray-500 text-sm py-4"
							>
								No links added yet
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Home indicator at bottom -->
		<div
			class="absolute bottom-1.5 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-white rounded-full opacity-90"
		></div>

		<!-- Floating tag showing it's a preview -->
		<div
			class="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold uppercase py-1 px-3 rounded-full shadow-lg"
		>
			Preview
		</div>
	</div>
</template>

<style scoped>
/* Custom scrollbar for the mobile preview */
.overflow-y-auto::-webkit-scrollbar {
	width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
	background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
	background-color: rgba(0, 0, 0, 0.1);
	border-radius: 4px;
}
</style>
