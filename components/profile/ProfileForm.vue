<script setup lang="ts">
const {
	userData,
	formErrors,
	fileInput,
	isDragging,
	isLoading,
	onImageSelected,
	onDragOver,
	onDragLeave,
	onDrop,
	removeProfileImage,
	addSocialLink,
	removeSocialLink,
	updatePlatformFromUrl,
	setPlatform,
	saveProfile,
} = useProfileForm()

const { platformOptions, getPlatformIcon } = useSocialPlatforms()

// Make userData available to parent components
defineExpose({ userData })
</script>

<template>
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
			<UFormGroup label="Profile Image">
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
							class="w-20 h-20 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border relative group"
							:class="
								userData.profileImage ? 'border-primary' : 'border-gray-300'
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
						<UIcon name="i-mdi-information-outline" class="inline mr-1" />
						Drag and drop an image here, or click to browse
					</p>
				</div>
			</UFormGroup>
		</div>

		<!-- Name Input -->
		<div class="mb-6">
			<UFormGroup label="Display Name" :error="formErrors.name || undefined">
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
					<p class="text-sm text-gray-600">Add links to your social profiles</p>
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
					v-for="(social, index) in userData.socials"
					:key="index"
					class="bg-gray-50 p-5 rounded-lg border border-gray-100 shadow-sm"
				>
					<div class="flex justify-between items-center mb-3">
						<span class="flex items-center gap-2">
							<UIcon :name="social.icon" class="text-lg" />
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
							v-model="userData.socials[index].platform"
							:items="platformOptions"
							:icon="
								social.platform
									? getPlatformIcon(social.platform)
									: 'i-mdi-link-variant'
							"
							color="primary"
							variant="outline"
							class="w-full"
							placeholder="Select platform"
							value-attribute="value"
							@update:model-value="val => setPlatform(val, index)"
						>
							<template #item="{ item }">
								<div v-if="item" class="flex items-center gap-2">
									<UIcon :name="item.icon || ''" class="flex-shrink-0" />
									<span>{{ item.label || '' }}</span>
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
							@update:model-value="updatePlatformFromUrl(social.url, index)"
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
