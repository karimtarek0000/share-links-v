import { reactive, ref } from 'vue'
import { useSocialPlatforms } from './useSocialPlatforms'

export function useProfileForm() {
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

	const { detectPlatform } = useSocialPlatforms()
	const toast = useToast()

	// Define reactive state for form data
	const userData = reactive({
		name: '',
		bio: '',
		profileImage: '' as string | null,
		socials: [
			{
				platform: 'instagram' as PlatformKey,
				url: '',
				icon: 'i-mdi-instagram',
			},
			{ platform: 'twitter' as PlatformKey, url: '', icon: 'i-mdi-twitter' },
			{ platform: 'linkedin' as PlatformKey, url: '', icon: 'i-mdi-linkedin' },
		] as Array<{ platform: PlatformKey | string; url: string; icon: string }>,
	})

	// Form validation state
	const formErrors = reactive({
		name: '',
		bio: '',
		socials: [] as string[],
	})

	// File upload state
	const fileInput = ref<HTMLInputElement | null>(null)
	const isDragging = ref(false)
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
		userData.socials.push({
			platform: 'other',
			url: '',
			icon: 'i-mdi-link-variant',
		})
		// Also add a corresponding error slot
		formErrors.socials.push('')
	}

	// Remove a social media link
	function removeSocialLink(index: number): void {
		userData.socials.splice(index, 1)
		formErrors.socials.splice(index, 1)
	}

	// Update platform when URL changes
	function updatePlatformFromUrl(url: string, index: number): void {
		if (!url) return
		const { platform, icon } = detectPlatform(url)
		userData.socials[index].platform = platform
		userData.socials[index].icon = icon
	}

	// Manually set platform
	function setPlatform(platform: string | null, index: number): void {
		if (!platform) return

		const { getPlatformIcon } = useSocialPlatforms()
		userData.socials[index].platform = platform
		userData.socials[index].icon = getPlatformIcon(platform)
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

	// Save profile
	const saveProfile = async (): Promise<void> => {
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

	return {
		userData,
		formErrors,
		fileInput,
		isDragging,
		isLoading,
		isValidUrl,
		onImageSelected,
		onDragOver,
		onDragLeave,
		onDrop,
		removeProfileImage,
		addSocialLink,
		removeSocialLink,
		updatePlatformFromUrl,
		setPlatform,
		validateForm,
		saveProfile,
	}
}
