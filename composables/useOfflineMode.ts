import { onMounted, onUnmounted, ref } from 'vue'

export default function useOfflineMode(
	fnSendDataToServer: () => Promise<void>,
) {
	// Network status tracking
	const isOnline = ref(navigator.onLine)
	const hasUnsavedChanges = ref(false)
	const isSyncing = ref(false)
	const toast = useToast()

	// Setup event listeners for online/offline status
	onMounted(() => {
		window.addEventListener('online', handleOnline)
		window.addEventListener('offline', handleOffline)
	})

	onUnmounted(() => {
		window.removeEventListener('online', handleOnline)
		window.removeEventListener('offline', handleOffline)
	})

	// Handle online event
	async function handleOnline() {
		isOnline.value = true
		toast.add({
			title: "You're back online",
			color: 'success',
			icon: 'i-mdi-wifi',
		})

		// Notify that we're back online if there are unsaved changes
		if (hasUnsavedChanges.value) {
			startSync()

			toast.add({
				title: 'Unsaved changes detected will sync data now ✌️',
				description: 'Syncing offline changes to the server',
				color: 'info',
				icon: 'i-mdi-cloud-sync',
			})

			try {
				await fnSendDataToServer()

				endSync(true)
				hasUnsavedChanges.value = false
			} catch (error: any) {
				toast.add({
					title: 'Sync failed',
					description: error.message || 'Failed to sync offline changes',
					color: 'error',
					icon: 'i-mdi-cloud-alert',
				})
				endSync(false)
			}
		}
	}

	// Handle offline event
	function handleOffline() {
		isOnline.value = false
		toast.add({
			title: "You're offline",
			description: 'Changes will be saved locally',
			color: 'warning',
			icon: 'f7:wifi-slash',
		})
	}

	// Save data to local storage
	const activateSyncDataState = (): boolean => (hasUnsavedChanges.value = true)

	// Start syncing process
	const startSync = () => (isSyncing.value = true)

	// End syncing process
	const endSync = (success: boolean = true) => {
		isSyncing.value = false

		if (success) {
			toast.add({
				title: 'Synced successfully',
				description: 'Your offline changes have been uploaded',
				color: 'success',
				icon: 'i-mdi-cloud-sync',
			})
		} else {
			toast.add({
				title: 'Sync failed',
				description: 'Failed to sync offline changes',
				color: 'error',
				icon: 'i-mdi-cloud-alert',
			})
		}
	}

	return {
		isOnline,
		hasUnsavedChanges,
		isSyncing,
		activateSyncDataState,
	}
}
