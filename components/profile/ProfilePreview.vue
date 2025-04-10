<script setup lang="ts">
defineProps<{
	userData: UserData
}>()

const { getPlatformColor } = useSocialPlatforms()
</script>

<template>
	<div class="relative">
		<!-- Mobile device mockup with modern design -->
		<div
			class="w-[280px] h-[560px] bg-gradient-to-br from-gray-950 to-gray-800 rounded-[42px] p-3.5 shadow-2xl relative overflow-hidden border border-gray-700"
		>
			<!-- Notch design -->
			<div
				class="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-7 bg-black rounded-b-2xl z-10"
			></div>

			<div
				class="h-full w-full bg-white dark:bg-gray-900 rounded-[36px] overflow-hidden flex flex-col shadow-inner"
			>
				<!-- Phone status bar -->
				<div
					class="bg-gray-50 dark:bg-gray-800 px-4 py-2 flex justify-between items-center border-b border-gray-100 dark:border-gray-700"
				>
					<span class="text-xs font-medium">9:41</span>
					<div class="flex space-x-2">
						<UIcon name="i-mdi-signal" class="text-sm" />
						<UIcon name="i-mdi-wifi" class="text-sm" />
						<UIcon name="i-mdi-battery" class="text-sm" />
					</div>
				</div>

				<!-- Phone content -->
				<div
					class="flex-1 overflow-y-auto bg-white dark:bg-gray-900 scroll-smooth"
				>
					<div class="flex flex-col items-center p-6">
						<!-- Profile Image Preview -->
						<div
							class="mt-4 w-28 h-28 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center shadow-lg border-2 border-primary/80 transition-transform hover:scale-105"
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
								class="text-gray-400 text-5xl"
							/>
						</div>

						<!-- Name Preview -->
						<h2
							class="text-xl font-bold mt-5 text-center text-gray-800 dark:text-white"
						>
							{{ userData.name || 'Your Name' }}
						</h2>

						<!-- Bio Preview -->
						<p
							class="text-sm text-gray-600 dark:text-gray-300 mt-3 text-center max-w-[220px] leading-relaxed"
						>
							{{ userData.bio || 'Your short bio will appear here' }}
						</p>

						<!-- Social Links Preview -->
						<div class="w-full mt-7 space-y-3.5 px-3">
							<UTooltip
								v-for="(social, index) in userData.socials"
								:key="index"
								text="Click to visit"
							>
								<a
									href="#"
									class="block w-full rounded-lg shadow-sm p-3.5 flex items-center justify-center gap-3 transition-all duration-300 transform hover:-translate-y-0.5"
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
								class="text-center text-gray-500 dark:text-gray-400 text-sm py-6 italic"
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
			class="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1.5 bg-white/90 rounded-full"
		></div>

		<!-- Floating tag showing it's a preview -->
		<div
			class="absolute -top-3 -right-3 bg-primary text-white text-xs font-bold uppercase py-1.5 px-4 rounded-full shadow-xl transform rotate-2"
		>
			Preview
		</div>
	</div>
</template>

<style scoped>
/* Custom scrollbar for the mobile preview */
.overflow-y-auto::-webkit-scrollbar {
	width: 3px;
}

.overflow-y-auto::-webkit-scrollbar-track {
	background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
	background-color: rgba(0, 0, 0, 0.15);
	border-radius: 10px;
}

/* Dark mode scrollbar */
@media (prefers-color-scheme: dark) {
	.overflow-y-auto::-webkit-scrollbar-thumb {
		background-color: rgba(255, 255, 255, 0.15);
	}
}

/* Smooth hover effects */
a {
	backface-visibility: hidden;
	will-change: transform;
}
</style>
