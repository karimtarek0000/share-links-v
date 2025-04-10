<script setup lang="ts">
// Define type for a social media platform
interface SocialLink {
	platform: string
	url: string
	icon: string
}

interface PlatformColors {
	bg: string
	text: string
	hover: string
}

interface PlatformOption {
	value: string
	label: string
	icon: string
}

// Define reactive state for form data
const userData = reactive({
	name: '',
	bio: '',
	profileImage: '' as string | null,
	socials: [
		{ platform: 'instagram', url: '', icon: 'i-mdi-instagram' },
		{ platform: 'twitter', url: '', icon: 'i-mdi-twitter' },
		{ platform: 'linkedin', url: '', icon: 'i-mdi-linkedin' },
	] as SocialLink[],
})

// Form validation state
const formErrors = reactive({
	name: '',
	bio: '',
	socials: [] as string[],
})

// File input ref
const fileInput = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const toast = useToast()
const isLoading = ref(false)

// Handle image upload
function onImageSelected(event: Event): void {
	const target = event.target as HTMLInputElement
	const file = target.files?.[0]

	if (file) {
		// Validate file size (max 5MB)
		if (file.size > 5 * 1024 * 1024) {
			toast.add({
				title: 'File too large',
				description: 'Profile image must be less than 5MB',
				color: 'error',
			})
			return
		}

		// Validate file type
		if (
			!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(
				file.type,
			)
		) {
			toast.add({
				title: 'Invalid file type',
				description: 'Please upload a JPG, PNG, GIF or WEBP image',
				color: 'error',
			})
			return
		}

		// Create object URL and clean up previous one if exists
		if (userData.profileImage && userData.profileImage.startsWith('blob:')) {
			URL.revokeObjectURL(userData.profileImage)
		}

		userData.profileImage = URL.createObjectURL(file)
	}
}

// Handle drag and drop for image
function onDragOver(event: DragEvent): void {
	event.preventDefault()
	isDragging.value = true
}

function onDragLeave(): void {
	isDragging.value = false
}

function onDrop(event: DragEvent): void {
	event.preventDefault()
	isDragging.value = false

	const files = event.dataTransfer?.files
	if (files && files.length > 0) {
		const fileInput = document.createElement('input')
		fileInput.type = 'file'
		fileInput.files = files
		onImageSelected({ target: fileInput } as unknown as Event)
	}
}

// Remove profile image
function removeProfileImage(): void {
	if (userData.profileImage && userData.profileImage.startsWith('blob:')) {
		URL.revokeObjectURL(userData.profileImage)
	}
	userData.profileImage = null
}

// Add a new social media link
function addSocialLink(): void {
	userData.socials.push({ platform: '', url: '', icon: 'i-mdi-link-variant' })
	// Also add a corresponding error slot
	formErrors.socials.push('')
}

// Remove a social media link
function removeSocialLink(index: number): void {
	userData.socials.splice(index, 1)
	formErrors.socials.splice(index, 1)
}

// Platform options for dropdown
const platformOptions: PlatformOption[] = [
	{ value: 'instagram', label: 'Instagram', icon: 'i-mdi-instagram' },
	{ value: 'twitter', label: 'Twitter/X', icon: 'i-mdi-twitter' },
	{ value: 'linkedin', label: 'LinkedIn', icon: 'i-mdi-linkedin' },
	{ value: 'github', label: 'GitHub', icon: 'i-mdi-github' },
	{ value: 'facebook', label: 'Facebook', icon: 'i-mdi-facebook' },
	{ value: 'youtube', label: 'YouTube', icon: 'i-mdi-youtube' },
	{ value: 'tiktok', label: 'TikTok', icon: 'i-mdi-music-note' },
	{ value: 'other', label: 'Other', icon: 'i-mdi-link-variant' },
]

// Platform colors for styling
const platformColors: Record<string, PlatformColors> = {
	instagram: {
		bg: 'bg-pink-50',
		text: 'text-pink-600',
		hover: 'hover:bg-pink-100',
	},
	twitter: {
		bg: 'bg-blue-50',
		text: 'text-blue-500',
		hover: 'hover:bg-blue-100',
	},
	linkedin: {
		bg: 'bg-blue-100',
		text: 'text-blue-700',
		hover: 'hover:bg-blue-200',
	},
	github: { bg: 'bg-gray-800', text: 'text-white', hover: 'hover:bg-gray-700' },
	facebook: {
		bg: 'bg-blue-600',
		text: 'text-white',
		hover: 'hover:bg-blue-700',
	},
	youtube: { bg: 'bg-red-50', text: 'text-red-600', hover: 'hover:bg-red-100' },
	tiktok: { bg: 'bg-black', text: 'text-white', hover: 'hover:bg-gray-900' },
	other: {
		bg: 'bg-gray-100',
		text: 'text-gray-800',
		hover: 'hover:bg-gray-200',
	},
}

// Generate platform icon based on URL or set manual selection
function detectPlatform(url: string, index: number): void {
	// Only auto-detect if URL changes
	if (!url) return

	if (url.includes('instagram')) {
		userData.socials[index].platform = 'instagram'
		userData.socials[index].icon = 'i-mdi-instagram'
	} else if (url.includes('twitter') || url.includes('x.com')) {
		userData.socials[index].platform = 'twitter'
		userData.socials[index].icon = 'i-mdi-twitter'
	} else if (url.includes('linkedin')) {
		userData.socials[index].platform = 'linkedin'
		userData.socials[index].icon = 'i-mdi-linkedin'
	} else if (url.includes('github')) {
		userData.socials[index].platform = 'github'
		userData.socials[index].icon = 'i-mdi-github'
	} else if (url.includes('facebook') || url.includes('fb.com')) {
		userData.socials[index].platform = 'facebook'
		userData.socials[index].icon = 'i-mdi-facebook'
	} else if (url.includes('youtube') || url.includes('youtu.be')) {
		userData.socials[index].platform = 'youtube'
		userData.socials[index].icon = 'i-mdi-youtube'
	} else if (url.includes('tiktok')) {
		userData.socials[index].platform = 'tiktok'
		userData.socials[index].icon = 'i-mdi-music-note'
	} else {
		userData.socials[index].platform = 'other'
		userData.socials[index].icon = 'i-mdi-link-variant'
	}
}

// Manually set platform
function setPlatform(platform: string, index: number): void {
	if (!platform) return

	userData.socials[index].platform = platform
	const platformInfo = platformOptions.find(p => p.value === platform)
	if (platformInfo) {
		userData.socials[index].icon = platformInfo.icon
	}
}

// Validate form
function validateForm(): boolean {
	let isValid = true

	// Validate name
	if (!userData.name.trim()) {
		formErrors.name = 'Name is required'
		isValid = false
	} else {
		formErrors.name = ''
	}

	// Validate bio (optional, but limit length)
	if (userData.bio.length > 150) {
		formErrors.bio = 'Bio must be 150 characters or less'
		isValid = false
	} else {
		formErrors.bio = ''
	}

	// Validate social links
	userData.socials.forEach((social, index) => {
		if (social.url && !isValidUrl(social.url)) {
			formErrors.socials[index] = 'Please enter a valid URL'
			isValid = false
		} else {
			formErrors.socials[index] = ''
		}
	})

	return isValid
}

// URL validation helper
function isValidUrl(url: string): boolean {
	try {
		// Add protocol if missing
		if (!url.startsWith('http://') && !url.startsWith('https://')) {
			url = 'https://' + url
		}
		new URL(url)
		return true
	} catch {
		return false
	}
}

// Format URL (ensure it has protocol)
function formatUrl(url: string): string {
	if (!url) return ''
	if (!url.startsWith('http://') && !url.startsWith('https://')) {
		return 'https://' + url
	}
	return url
}

// Save profile
async function saveProfile(): Promise<void> {
	if (!validateForm()) {
		toast.add({
			title: 'Validation Error',
			description: 'Please fix the errors in the form',
			color: 'error',
		})
		return
	}

	isLoading.value = true

	try {
		// Simulate API call
		await new Promise(resolve => setTimeout(resolve, 1000))

		toast.add({
			title: 'Success!',
			description: 'Your profile has been saved',
			color: 'success',
		})

		// Here you would actually save the data to your backend
	} catch (error) {
		toast.add({
			title: 'Error',
			description: 'Failed to save your profile',
			color: 'error',
		})
	} finally {
		isLoading.value = false
	}
}
</script>

<template>
	<UContainer class="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
		<div class="max-w-6xl mx-auto">
			<header class="mb-8">
				<h1 class="text-3xl font-bold text-center text-gray-900">
					Share Links
				</h1>
				<p class="text-center text-gray-600 mt-2">
					Create your personalized social links page
				</p>
			</header>

			<!-- Main layout container -->
			<div class="flex flex-col md:flex-row gap-8 md:gap-12">
				<!-- Preview Section (Left on desktop, Top on mobile) -->
				<div class="w-full md:w-2/5 flex justify-center">
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
								<div
									class="bg-gray-100 px-4 py-2 flex justify-between items-center"
								>
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
										<p
											class="text-sm text-gray-600 mt-2 text-center max-w-[200px]"
										>
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
														social.platform
															? platformColors[social.platform]?.bg
															: platformColors.other.bg,
														social.platform
															? platformColors[social.platform]?.text
															: platformColors.other.text,
														social.platform
															? platformColors[social.platform]?.hover
															: platformColors.other.hover,
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
				</div>

				<!-- Form Section (Right on desktop, Bottom on mobile) -->
				<div class="w-full md:w-3/5">
					<UCard class="shadow-lg">
						<template #header>
							<div class="px-4 pt-4 pb-2">
								<h2 class="text-2xl font-semibold">Customize Your Links</h2>
								<p class="text-sm text-gray-600 mt-1">
									Update your profile information and manage your social links
								</p>
							</div>
						</template>

						<!-- Profile Image Upload -->
						<div class="mb-6">
							<UFormGroup label="Profile Image" :error="false">
								<div
									class="p-6 border-2 border-dashed rounded-xl flex flex-col items-center justify-center"
									:class="
										isDragging
											? 'border-primary bg-primary/5'
											: 'border-gray-300'
									"
									@dragover="onDragOver"
									@dragleave="onDragLeave"
									@drop="onDrop"
								>
									<div class="flex items-center space-x-4">
										<div
											class="w-20 h-20 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border relative group"
											:class="
												userData.profileImage
													? 'border-primary'
													: 'border-gray-300'
											"
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
												class="text-gray-400 text-3xl"
											/>

											<!-- Hover overlay -->
											<div
												v-if="userData.profileImage"
												class="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
												@click="removeProfileImage"
											>
												<UIcon name="i-mdi-trash" class="text-white text-xl" />
											</div>
										</div>

										<div class="space-y-2">
											<UButton
												color="primary"
												variant="soft"
												icon="i-mdi-upload"
												@click="fileInput?.click()"
											>
												Upload Image
											</UButton>
											<p class="text-xs text-gray-500">
												JPG, PNG, GIF or WEBP (max 5MB)
											</p>
										</div>
									</div>

									<input
										ref="fileInput"
										type="file"
										hidden
										accept="image/jpeg,image/png,image/gif,image/webp"
										@change="onImageSelected"
									/>

									<p class="text-sm text-gray-500 mt-4">
										<UIcon
											name="i-mdi-information-outline"
											class="inline mr-1"
										/>
										Drag and drop an image here, or click to browse
									</p>
								</div>
							</UFormGroup>
						</div>

						<!-- Name Input -->
						<div class="mb-6">
							<UFormGroup
								label="Display Name"
								:error="formErrors.name || undefined"
							>
								<UInput
									v-model="userData.name"
									placeholder="Your name"
									icon="i-mdi-account"
								/>
							</UFormGroup>
						</div>

						<!-- Bio Input -->
						<div class="mb-8">
							<UFormGroup
								label="Short Bio"
								:hint="`${userData.bio.length}/150 characters`"
								:error="formErrors.bio || undefined"
							>
								<UTextarea
									v-model="userData.bio"
									placeholder="A short description about you"
									:rows="2"
									maxlength="150"
								/>
							</UFormGroup>
						</div>

						<!-- Social Links Section -->
						<div>
							<div
								class="flex justify-between items-center mb-5 bg-gray-50 p-4 rounded-lg"
							>
								<div>
									<h3 class="text-lg font-medium flex items-center gap-2">
										<UIcon name="i-mdi-link-variant" class="text-primary" />
										Your Social Links
									</h3>
									<p class="text-sm text-gray-600">
										Add links to your social profiles
									</p>
								</div>
								<UButton
									color="primary"
									variant="soft"
									icon="i-mdi-plus"
									@click="addSocialLink"
								>
									Add Link
								</UButton>
							</div>

							<!-- Empty state -->
							<div
								v-if="!userData.socials.length"
								class="text-center bg-gray-50 p-8 rounded-lg mb-5"
							>
								<UIcon
									name="i-mdi-link-off"
									class="text-gray-400 text-4xl mx-auto"
								/>
								<h4 class="text-gray-600 font-medium mt-3">
									No links added yet
								</h4>
								<p class="text-gray-500 text-sm mt-2">
									Add your first social media link to get started
								</p>
								<UButton
									color="primary"
									class="mt-4"
									icon="i-mdi-plus"
									@click="addSocialLink"
								>
									Add Your First Link
								</UButton>
							</div>

							<!-- Social Links Inputs -->
							<TransitionGroup name="links-list" tag="div" class="space-y-4">
								<div
									v-for="(social, index) in userData.socials"
									:key="index"
									class="bg-gray-50 p-5 rounded-lg border border-gray-100 shadow-sm"
								>
									<div class="flex justify-between items-center mb-3">
										<span class="flex items-center gap-2">
											<UIcon
												:name="social.icon"
												class="text-lg"
												:class="
													social.platform
														? platformColors[social.platform]?.text
														: 'text-gray-600'
												"
											/>
											<span class="font-medium">Link #{{ index + 1 }}</span>
										</span>
										<UButton
											color="error"
											icon="i-mdi-delete"
											variant="ghost"
											size="sm"
											@click="removeSocialLink(index)"
										/>
									</div>

									<!-- Platform select -->
									<UFormGroup label="Platform" class="mb-3">
										<USelectMenu
											v-model="social.platform"
											:options="platformOptions"
											color="primary"
											variant="outline"
											class="w-full"
											placeholder="Select platform"
											@change="setPlatform(social.platform, index)"
										>
											<template #option="{ option }">
												<div class="flex items-center gap-2">
													<UIcon :name="option.icon" class="flex-shrink-0" />
													<span>{{ option.label }}</span>
												</div>
											</template>
										</USelectMenu>
									</UFormGroup>

									<!-- Link input -->
									<UFormGroup
										label="Link"
										:error="formErrors.socials[index] || undefined"
									>
										<UInput
											v-model="social.url"
											:placeholder="
												social.platform
													? `Your ${social.platform} profile URL`
													: 'https://example.com/your-profile'
											"
											icon="i-mdi-link-variant"
											@update:model-value="detectPlatform(social.url, index)"
										/>
									</UFormGroup>
								</div>
							</TransitionGroup>
						</div>

						<template #footer>
							<!-- Save Button -->
							<UButton
								block
								color="primary"
								size="lg"
								:loading="isLoading"
								:disabled="isLoading"
								@click="saveProfile"
							>
								<UIcon name="i-mdi-check" class="mr-1" />
								Save Profile
							</UButton>
						</template>
					</UCard>
				</div>
			</div>
		</div>
	</UContainer>
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

/* Transition animations for the social links list */
.links-list-enter-active,
.links-list-leave-active {
	transition: all 0.3s ease;
}

.links-list-enter-from,
.links-list-leave-to {
	opacity: 0;
	transform: translateY(-20px);
}
</style>
