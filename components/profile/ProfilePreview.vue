<script setup lang="ts">
defineProps<{ userData: UserData }>()

const { getPlatformColor } = useSocialPlatforms()
</script>

<template>
	<div class="relative">
		<!-- Modern premium device mockup -->
		<div class="relative w-[320px] mx-auto">
			<!-- Device frame -->
			<div
				class="relative bg-gradient-to-br from-zinc-700 to-zinc-900 rounded-[38px] p-3 shadow-[0_20px_70px_-15px_rgba(0,0,0,0.4)] border border-zinc-700"
			>
				<!-- Device screen -->
				<div
					class="relative h-[620px] bg-white dark:bg-gray-900 rounded-[32px] overflow-hidden shadow-inner"
				>
					<!-- Notch -->
					<div
						class="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-7 bg-black rounded-b-3xl z-10"
					></div>

					<!-- Camera dot -->
					<div
						class="absolute top-2 right-[100px] w-2.5 h-2.5 rounded-full bg-gray-800 z-10 flex items-center justify-center"
					>
						<div class="w-1.5 h-1.5 rounded-full bg-gray-900"></div>
					</div>

					<!-- Status bar -->
					<div
						class="relative h-12 px-6 flex items-center justify-between bg-gradient-to-b from-white/90 to-white/60 dark:from-gray-900/90 dark:to-gray-900/60 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800 z-[1]"
					>
						<span class="text-xs font-semibold">9:41</span>
						<div class="flex items-center gap-1.5">
							<UIcon name="i-mdi-signal" class="w-4 h-4" />
							<UIcon name="i-mdi-wifi" class="w-4 h-4" />
							<UIcon name="i-mdi-battery" class="w-4 h-4" />
						</div>
					</div>

					<!-- Content area -->
					<div class="h-[calc(100%-48px)] overflow-y-auto scroll-smooth">
						<!-- Profile content -->
						<div class="flex flex-col items-center px-6 pt-8 pb-6">
							<!-- Profile image -->
							<div class="group relative w-28 h-28 mb-6">
								<!-- Profile image background decorations -->
								<div
									class="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 blur-md group-hover:blur transition-all duration-500"
								></div>
								<div
									class="absolute inset-0 -m-1 rounded-full bg-gradient-to-br from-primary to-primary-600 opacity-40 group-hover:opacity-60 transition-opacity duration-500"
								></div>

								<!-- Profile image container -->
								<div
									class="relative h-full w-full rounded-full border-2 border-white dark:border-gray-800 p-1 bg-white dark:bg-gray-800 overflow-hidden shadow-lg z-10 group-hover:scale-[1.02] transition-transform duration-300"
								>
									<img
										v-if="userData.profileImage"
										:src="userData.profileImage"
										class="w-full h-full object-cover rounded-full"
										alt="Profile"
									/>
									<div
										v-else
										class="w-full h-full rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center"
									>
										<UIcon
											name="i-mdi-account"
											class="text-gray-400 dark:text-gray-300 text-4xl"
										/>
									</div>
								</div>
							</div>

							<!-- Profile name -->
							<h2 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
								{{ userData.name || 'Your Name' }}
							</h2>

							<!-- Bio -->
							<p
								class="text-sm text-gray-600 dark:text-gray-300 text-center max-w-[230px] mb-8 leading-relaxed"
							>
								{{ userData.bio || 'Your short bio will appear here' }}
							</p>

							<!-- Social links -->
							<div class="w-full space-y-3">
								<UTooltip
									v-for="(social, index) in userData.socials"
									:key="index"
									text="Click to visit"
								>
									<a
										href="#"
										class="flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 shadow-sm hover:shadow active:scale-[0.98]"
										:class="[
											getPlatformColor(social.platform, 'bg'),
											getPlatformColor(social.platform, 'text'),
											getPlatformColor(social.platform, 'hover'),
										]"
									>
										<UIcon :name="social.icon" class="text-xl flex-shrink-0" />
										<span class="font-medium text-sm">
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
									class="text-center text-gray-500 dark:text-gray-400 text-sm py-8 italic"
								>
									No links added yet
								</p>
							</div>
						</div>
					</div>
				</div>

				<!-- Home button/indicator -->
				<div
					class="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-400/30 dark:bg-gray-400/20 rounded-full"
				></div>
			</div>

			<!-- Device details -->
			<div
				class="absolute -right-[2px] top-[100px] w-[3px] h-10 bg-zinc-800 rounded-l-md"
			></div>
			<div
				class="absolute -right-[2px] top-[150px] w-[3px] h-16 bg-zinc-800 rounded-l-md"
			></div>
			<div
				class="absolute -left-[2px] top-[120px] w-[3px] h-24 bg-zinc-800 rounded-r-md"
			></div>

			<!-- Reflection effect -->
			<div
				class="absolute top-5 left-12 w-32 h-1/3 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-md -rotate-[30deg] pointer-events-none"
			></div>
		</div>
	</div>
</template>

<style scoped>
/* Custom scrollbar */
.overflow-y-auto::-webkit-scrollbar {
	width: 3px;
}

.overflow-y-auto::-webkit-scrollbar-track {
	background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
	border-radius: 10px;
}
</style>
