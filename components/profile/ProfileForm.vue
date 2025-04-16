<script setup lang="ts">
import { profileSchema, validateProfile } from '@/validation/profileSchema'

// -----------------------------
// Reactive State
// -----------------------------

// Create reactive form state
const state = reactive<UserData>({
	name: '',
	bio: '',
	profileImage: null,
	socials: [],
})

// Validation state
const errors = ref<any[]>([])
const fieldsToValidate = ref<Set<string>>(new Set())

// File upload state
const fileInput = ref<HTMLInputElement | null>(null)
const imgFile = ref<File | null>(null)
const userId = ref(null)
const isDragging = ref(false)
const isLoading = ref(false)

// Get platform detection and toast
const { detectPlatform, extractUsername } = useSocialPlatforms()
const toast = useToast()
const {
	addProfile,
	getProfile,
	updateProfile,
	uploadProfileImage,
	deleteProfileImage,
} = useProfileApi()
const { user } = useSupabase()

// Store extracted usernames
const extractedUsernames = ref<Record<number, string | null>>({})

// This for make sure data will getting after redirect to the page
await useAsyncData(async () => {
	try {
		const { body } = await getProfile(user.value?.user.id)
		state.name = body.name || ''
		state.bio = body.bio || ''
		state.profileImage = body.img || null
		state.socials = body.social_links.map((link: string) => ({
			platform: detectPlatform(link).platform,
			url: link,
			icon: detectPlatform(link).icon,
		}))

		userId.value = body.id
		user.value.img = body.img
	} catch (error: any) {
		toast.add({
			title: error.message || 'Error fetching profile data',
			description: 'Failed to retrieve your profile data',
			color: 'error',
			icon: 'i-mdi-alert',
		})
	}
})

// -----------------------------
// Computed Properties
// -----------------------------

// Check if form is valid using Zod schema directly
const isFormValid = computed(() => {
	// Directly use profileSchema to validate the entire form
	const result = profileSchema.safeParse(state)
	return result.success
})

// Get the file name from the profile image URL
const pathImg = computed(() => {
	if (!state.profileImage) return null
	const parts = state.profileImage.split('/')
	return `${parts[parts.length - 2]}-${parts[parts.length - 1]}`
})

// Payload for the profile data
const profileData = computed(() => ({
	user_id: user.value?.user.id,
	name: state.name,
	bio: state.bio,
	img: state.profileImage || '',
	social_links: state.socials.map(social => social.url),
}))

// -----------------------------
// Methods
// -----------------------------

// Validation Methods
const validateField = (fieldName: string) => {
	if (fieldName.startsWith('socials.')) {
		// For social URL fields, add to validation set
		fieldsToValidate.value.add(fieldName)
		// Also add the socials array itself to validate its length
		fieldsToValidate.value.add('socials')
	} else {
		// For other fields, simply add to the set
		fieldsToValidate.value.add(fieldName)
	}

	// Run validation only on touched fields
	const filteredState = { ...state }
	errors.value = validateProfile(filteredState).filter(
		error =>
			fieldsToValidate.value.has(error.name) ||
			(error.name === 'socials' && fieldsToValidate.value.has('socials')),
	)
}

// Image Handling Methods
async function onImageSelected(event: Event) {
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
		if (state.profileImage && state.profileImage.startsWith('blob:')) {
			URL.revokeObjectURL(state.profileImage)
		}

		if (state.profileImage) {
			await deleteImgProfile(false)
		}

		imgFile.value = file
		state.profileImage = URL.createObjectURL(file)

		await uploadImgProfile()
	}
}

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

async function removeProfileImage() {
	if (state.profileImage && state.profileImage.startsWith('blob:')) {
		URL.revokeObjectURL(state.profileImage)
	}
	await deleteImgProfile()
}

// Social Links Methods
function addSocialLink(): void {
	state.socials.push({
		platform: 'other',
		url: '',
		icon: 'i-mdi-link-variant',
	})
	// Validate socials array after adding a new link
	validateField('socials')
}

function removeSocialLink(index: number): void {
	state.socials.splice(index, 1)
	// Remove extracted username for this index
	delete extractedUsernames.value[index]
	// Validate socials array after removing a link
	validateField('socials')
}

function handleUrlChange(url: string, index: number): void {
	// Validate the field
	validateField(`socials.${index}.url`)

	// Update platform detection
	if (!url) {
		extractedUsernames.value[index] = null
		return
	}

	const { platform, icon } = detectPlatform(url)
	state.socials[index].platform = platform
	state.socials[index].icon = icon

	// Extract username if possible
	extractedUsernames.value[index] = extractUsername(url, platform)
}

// Upload and Delete Image Methods
async function uploadImgProfile() {
	isLoading.value = true
	try {
		const { body } = await uploadProfileImage(
			imgFile.value as File,
			user.value?.user.id,
		)

		state.profileImage = body.publicUrl
		user.value.img = body.publicUrl
		toast.add({
			title: 'Profile image uploaded successfully',
			description: 'Your profile image has been uploaded',
			color: 'success',
			icon: 'i-mdi-check',
		})
	} catch (error: any) {
		toast.add({
			title: error.message || 'Error uploading image',
			description: 'Failed to upload your profile image',
			color: 'error',
			icon: 'i-mdi-alert',
		})
	} finally {
		isLoading.value = false
	}
}

async function deleteImgProfile(statusAlert: boolean = true) {
	isLoading.value = true
	try {
		await deleteProfileImage(user.value?.user.id, pathImg.value as string)

		imgFile.value = null
		state.profileImage = null
		user.value.img = null

		if (statusAlert) {
			toast.add({
				title: 'Profile image deleted successfully',
				description: 'Your profile image has been deleted',
				color: 'success',
				icon: 'i-mdi-check',
			})
		}
	} catch (error: any) {
		if (statusAlert) {
			toast.add({
				title: error.message || 'Error deleting image',
				description: 'Failed to delete your profile image',
				color: 'error',
				icon: 'i-mdi-alert',
			})
		}
	} finally {
		isLoading.value = false
	}
}
async function addNewProfile() {
	isLoading.value = true
	try {
		await addProfile(profileData.value)

		toast.add({
			title: 'Profile saved successfully',
			description: 'Your profile has been saved',
			color: 'success',
			icon: 'i-mdi-check',
		})
	} catch (error: any) {
		toast.add({
			title: error.message || 'Error saving profile',
			description: 'Failed to save your profile',
			color: 'error',
			icon: 'i-mdi-alert',
		})
	} finally {
		isLoading.value = false
	}
}
async function updateDataProfile() {
	isLoading.value = true
	try {
		await updateProfile(profileData.value)

		toast.add({
			title: 'Profile updated successfully',
			description: 'Your profile has been updated',
			color: 'success',
			icon: 'i-mdi-check',
		})
	} catch (error: any) {
		toast.add({
			title: error.message || 'Error updating profile',
			description: 'Failed to update your profile',
			color: 'error',
			icon: 'i-mdi-alert',
		})
	} finally {
		isLoading.value = false
	}
}
// Form submission handler
async function onSubmit() {
	userId.value ? updateDataProfile() : addNewProfile()
}

// Make userData available to parent components
defineExpose({ userData: state })
</script>

<template>
	<UForm
		:validate="validateProfile"
		:state="state"
		class="space-y-6"
		@submit="onSubmit"
	>
		<UCard class="shadow-lg">
			<template #header>
				<div class="px-4 pt-4 pb-2 text-center">
					<h2 class="text-2xl font-semibold">Customize Your Links</h2>
					<p class="text-sm text-gray-600 mt-1">
						Update your profile information and manage your social links
					</p>
				</div>
			</template>

			<!-- Profile Image Upload -->
			<div class="mb-6">
				<div
					class="p-6 border-2 border-dashed rounded-xl flex flex-col items-center justify-center"
					:class="
						isDragging ? 'border-primary bg-primary/5' : 'border-gray-300'
					"
					@dragover="onDragOver"
					@dragleave="onDragLeave"
					@drop="onDrop"
				>
					<div class="flex items-center space-x-4">
						<div
							class="w-20 h-20 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border relative"
							:class="state.profileImage ? 'border-primary' : 'border-gray-300'"
						>
							<img
								v-if="state.profileImage"
								:src="state.profileImage"
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
								v-if="state.profileImage"
								class="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
								:class="{
									'pointer-events-none !opacity-0': isLoading,
								}"
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
								:class="{
									'pointer-events-none': isLoading,
								}"
								@click="fileInput?.click()"
							>
								Upload Image
							</UButton>
							<p class="text-xs text-gray-500 text-center">
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

					<p class="text-sm text-gray-500 mt-4 text-center">
						<UIcon name="i-mdi-information-outline" class="inline mr-1" />
						Drag and drop an image here, or click to browse
					</p>
				</div>
			</div>

			<!-- Name Input -->
			<UFormField name="name" label="Display Name">
				<UInput
					v-model="state.name"
					placeholder="Your name"
					icon="i-mdi-account"
					:color="errors.find(e => e.name === 'name') ? 'error' : undefined"
					class="focus-state-ring w-full shadow-sm hover:border-gray-400"
					input-class="placeholder:text-gray-400 font-medium"
					size="lg"
					trailing-icon="i-mdi-pencil-outline"
					@update:model-value="validateField('name')"
				/>
				<template #error>
					<p
						v-if="errors.find(e => e.name === 'name')"
						class="text-red-500 text-sm animate-pulse"
					>
						{{ errors.find(e => e.name === 'name')?.message }}
					</p>
				</template>
			</UFormField>

			<!-- Bio Input -->
			<UFormField name="bio" label="Short Bio" class="mt-6 mb-8">
				<div class="relative">
					<UTextarea
						style="resize: none"
						v-model="state.bio"
						placeholder="A short description about you"
						:rows="5"
						maxlength="150"
						:color="errors.find(e => e.name === 'bio') ? 'error' : undefined"
						class="focus-state-ring w-full shadow-sm"
						input-class="placeholder:text-gray-400 font-medium pb-8"
						size="lg"
						@update:model-value="validateField('bio')"
					/>
					<div
						class="absolute bottom-3 right-3 text-xs"
						:class="state.bio.length > 150 ? 'text-red-500' : 'text-gray-500'"
					>
						{{ state.bio.length }}/150
					</div>
				</div>
				<template #error>
					<p
						v-if="errors.find(e => e.name === 'bio')"
						class="text-red-500 text-sm animate-pulse"
					>
						{{ errors.find(e => e.name === 'bio')?.message }}
					</p>
				</template>
			</UFormField>

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

				<!-- Social links validation message -->
				<p
					v-if="
						errors.find(
							e => e.name.startsWith('socials') && e.name.length === 7,
						)
					"
					class="text-red-500 text-sm mb-4 bg-red-50 p-2 rounded"
				>
					{{
						errors.find(
							e => e.name.startsWith('socials') && e.name.length === 7,
						)?.message
					}}
				</p>

				<!-- Empty state -->
				<div
					v-if="!state.socials.length"
					class="text-center bg-gray-50 p-8 rounded-lg mb-5"
				>
					<UIcon name="i-mdi-link-off" class="text-gray-400 text-4xl mx-auto" />
					<h4 class="text-gray-600 font-medium mt-3">No links added yet</h4>
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
						v-for="(social, index) in state.socials"
						:key="index"
						class="bg-gray-50 p-5 rounded-lg border border-gray-100 shadow-sm"
						:class="
							errors.find(e => e.name === `socials.${index}.url`)
								? 'border-red-300'
								: ''
						"
					>
						<div class="flex justify-between items-center mb-3">
							<span class="flex items-center gap-2">
								<UIcon :name="social.icon" class="text-lg" />
								<span class="font-medium capitalize">{{
									social.platform
								}}</span>
								<span
									v-if="extractedUsernames[index]"
									class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full"
								>
									{{ extractedUsernames[index] }}
								</span>
							</span>
							<UButton
								color="error"
								icon="i-mdi-delete"
								variant="ghost"
								size="sm"
								@click="removeSocialLink(index)"
							/>
						</div>

						<!-- Link input -->
						<UFormField :name="`socials.${index}.url`" label="Link">
							<UInput
								v-model="social.url"
								:placeholder="
									social.platform
										? `Your ${social.platform} profile URL`
										: 'https://example.com/your-profile'
								"
								icon="i-mdi-link-variant"
								:color="
									errors.find(e => e.name === `socials.${index}.url`)
										? 'error'
										: undefined
								"
								class="w-full"
								@update:model-value="handleUrlChange(social.url, index)"
							/>
							<template #error>
								<p
									v-if="errors.find(e => e.name === `socials.${index}.url`)"
									class="text-red-500 text-sm animate-pulse"
								>
									{{
										errors.find(e => e.name === `socials.${index}.url`)?.message
									}}
								</p>
							</template>
						</UFormField>
					</div>
				</TransitionGroup>
			</div>

			<template #footer>
				<!-- Save Button -->
				<UButton
					type="submit"
					block
					color="primary"
					size="lg"
					:loading="isLoading"
					:disabled="isLoading || !isFormValid"
				>
					<UIcon name="i-mdi-check" class="mr-1" />
					{{ userId ? 'Update Profile' : 'Create Profile' }}
				</UButton>
			</template>
		</UCard>
	</UForm>
</template>

<style scoped>
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
