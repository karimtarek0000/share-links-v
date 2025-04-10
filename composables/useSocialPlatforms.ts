// Define a strategy interface for platform detection
interface PlatformDetectionStrategy {
	canHandle(url: string): boolean
	getPlatformDetails(): { platform: PlatformKey; icon: string }
}

export function useSocialPlatforms() {
	// Platform options for dropdown - Define as a regular array for easier template usage
	const platformOptions: PlatformOption[] = [
		{
			value: 'instagram' as PlatformKey,
			label: 'Instagram',
			icon: 'i-mdi-instagram',
		},
		{
			value: 'twitter' as PlatformKey,
			label: 'Twitter/X',
			icon: 'i-mdi-twitter',
		},
		{
			value: 'facebook' as PlatformKey,
			label: 'Facebook',
			icon: 'i-mdi-facebook',
		},
		{
			value: 'linkedin' as PlatformKey,
			label: 'LinkedIn',
			icon: 'i-mdi-linkedin',
		},
		{
			value: 'youtube' as PlatformKey,
			label: 'YouTube',
			icon: 'i-mdi-youtube',
		},
		{
			value: 'tiktok' as PlatformKey,
			label: 'TikTok',
			icon: 'i-mdi-music-note',
		},
		{
			value: 'snapchat' as PlatformKey,
			label: 'Snapchat',
			icon: 'i-mdi-snapchat',
		},
		{
			value: 'pinterest' as PlatformKey,
			label: 'Pinterest',
			icon: 'i-mdi-pinterest',
		},
		{ value: 'github' as PlatformKey, label: 'GitHub', icon: 'i-mdi-github' },
		{
			value: 'dribbble' as PlatformKey,
			label: 'Dribbble',
			icon: 'i-mdi-dribbble',
		},
		{
			value: 'behance' as PlatformKey,
			label: 'Behance',
			icon: 'i-mdi-behance',
		},
		{ value: 'medium' as PlatformKey, label: 'Medium', icon: 'i-mdi-medium' },
		{
			value: 'discord' as PlatformKey,
			label: 'Discord',
			icon: 'i-mdi-discord',
		},
		{ value: 'slack' as PlatformKey, label: 'Slack', icon: 'i-mdi-slack' },
		{
			value: 'telegram' as PlatformKey,
			label: 'Telegram',
			icon: 'i-mdi-telegram',
		},
		{
			value: 'whatsapp' as PlatformKey,
			label: 'WhatsApp',
			icon: 'i-mdi-whatsapp',
		},
		{ value: 'reddit' as PlatformKey, label: 'Reddit', icon: 'i-mdi-reddit' },
		{ value: 'twitch' as PlatformKey, label: 'Twitch', icon: 'i-mdi-twitch' },
		{
			value: 'spotify' as PlatformKey,
			label: 'Spotify',
			icon: 'i-mdi-spotify',
		},
		{
			value: 'soundcloud' as PlatformKey,
			label: 'SoundCloud',
			icon: 'i-mdi-soundcloud',
		},
		{ value: 'vimeo' as PlatformKey, label: 'Vimeo', icon: 'i-mdi-vimeo' },
		{
			value: 'other' as PlatformKey,
			label: 'Other Link',
			icon: 'i-mdi-link-variant',
		},
	]

	// Define type-safe color mapping
	const platformColors: Record<PlatformKey, PlatformColors> = {
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
		facebook: {
			bg: 'bg-blue-600',
			text: 'text-white',
			hover: 'hover:bg-blue-700',
		},
		linkedin: {
			bg: 'bg-blue-100',
			text: 'text-blue-700',
			hover: 'hover:bg-blue-200',
		},
		youtube: {
			bg: 'bg-red-50',
			text: 'text-red-600',
			hover: 'hover:bg-red-100',
		},
		tiktok: {
			bg: 'bg-black',
			text: 'text-white',
			hover: 'hover:bg-gray-900',
		},
		snapchat: {
			bg: 'bg-yellow-300',
			text: 'text-black',
			hover: 'hover:bg-yellow-200',
		},
		pinterest: {
			bg: 'bg-red-500',
			text: 'text-white',
			hover: 'hover:bg-red-600',
		},
		github: {
			bg: 'bg-gray-800',
			text: 'text-white',
			hover: 'hover:bg-gray-700',
		},
		dribbble: {
			bg: 'bg-pink-500',
			text: 'text-white',
			hover: 'hover:bg-pink-600',
		},
		behance: {
			bg: 'bg-blue-700',
			text: 'text-white',
			hover: 'hover:bg-blue-800',
		},
		medium: {
			bg: 'bg-green-50',
			text: 'text-green-900',
			hover: 'hover:bg-green-100',
		},
		discord: {
			bg: 'bg-indigo-500',
			text: 'text-white',
			hover: 'hover:bg-indigo-600',
		},
		slack: {
			bg: 'bg-purple-500',
			text: 'text-white',
			hover: 'hover:bg-purple-600',
		},
		telegram: {
			bg: 'bg-sky-500',
			text: 'text-white',
			hover: 'hover:bg-sky-600',
		},
		whatsapp: {
			bg: 'bg-green-500',
			text: 'text-white',
			hover: 'hover:bg-green-600',
		},
		reddit: {
			bg: 'bg-orange-500',
			text: 'text-white',
			hover: 'hover:bg-orange-600',
		},
		twitch: {
			bg: 'bg-purple-600',
			text: 'text-white',
			hover: 'hover:bg-purple-700',
		},
		spotify: {
			bg: 'bg-green-600',
			text: 'text-white',
			hover: 'hover:bg-green-700',
		},
		soundcloud: {
			bg: 'bg-orange-400',
			text: 'text-white',
			hover: 'hover:bg-orange-500',
		},
		vimeo: {
			bg: 'bg-sky-400',
			text: 'text-white',
			hover: 'hover:bg-sky-500',
		},
		other: {
			bg: 'bg-gray-100',
			text: 'text-gray-800',
			hover: 'hover:bg-gray-200',
		},
	}

	// Creating the platform detection strategies using a factory pattern
	const createPlatformStrategies = (): Record<
		PlatformKey,
		PlatformDetectionStrategy
	> => {
		const createStrategy = (
			platform: PlatformKey,
			patterns: string[],
		): PlatformDetectionStrategy => ({
			canHandle: (url: string): boolean => {
				if (!url) return false
				const lowerUrl = url.toLowerCase()
				return patterns.some(pattern => lowerUrl.includes(pattern))
			},
			getPlatformDetails: (): { platform: PlatformKey; icon: string } => {
				const platformInfo = platformOptions.find(p => p.value === platform)
				return {
					platform,
					icon: platformInfo?.icon || 'i-mdi-link-variant',
				}
			},
		})

		// Strategy instances for each platform
		return {
			instagram: createStrategy('instagram', ['instagram.com', 'instagr.am']),
			twitter: createStrategy('twitter', ['twitter.com', 'x.com', 't.co']),
			facebook: createStrategy('facebook', ['facebook.com', 'fb.com', 'fb.me']),
			linkedin: createStrategy('linkedin', ['linkedin.com', 'lnkd.in']),
			youtube: createStrategy('youtube', [
				'youtube.com',
				'youtu.be',
				'ytbe.com',
			]),
			tiktok: createStrategy('tiktok', ['tiktok.com', 'vm.tiktok']),
			snapchat: createStrategy('snapchat', ['snapchat.com', 'snap.com']),
			pinterest: createStrategy('pinterest', ['pinterest.com', 'pin.it']),
			github: createStrategy('github', ['github.com', 'github.io']),
			dribbble: createStrategy('dribbble', ['dribbble.com']),
			behance: createStrategy('behance', ['behance.net', 'be.net']),
			medium: createStrategy('medium', ['medium.com']),
			discord: createStrategy('discord', ['discord.com', 'discord.gg']),
			slack: createStrategy('slack', ['slack.com']),
			telegram: createStrategy('telegram', [
				'telegram.me',
				't.me',
				'telegram.org',
			]),
			whatsapp: createStrategy('whatsapp', ['whatsapp.com', 'wa.me']),
			reddit: createStrategy('reddit', ['reddit.com', 'redd.it']),
			twitch: createStrategy('twitch', ['twitch.tv']),
			spotify: createStrategy('spotify', [
				'spotify.com',
				'open.spotify.com',
				'spoti.fi',
			]),
			soundcloud: createStrategy('soundcloud', ['soundcloud.com', 'snd.sc']),
			vimeo: createStrategy('vimeo', ['vimeo.com', 'player.vimeo']),
			other: createStrategy('other', []),
		}
	}

	// Initialize strategies
	const platformStrategies = createPlatformStrategies()

	// Cache for previous URL detections to improve performance
	const detectionCache = new Map<
		string,
		{ platform: PlatformKey; icon: string }
	>()

	// Helper to safely get platform colors with fallback
	function getPlatformColor(
		platform: string | PlatformKey,
		type: keyof PlatformColors,
	): string {
		try {
			if (platform in platformColors) {
				return platformColors[platform as PlatformKey][type]
			}
			return platformColors.other[type]
		} catch (error) {
			console.error('Error retrieving platform color:', error)
			// Fallback colors if something goes wrong
			const fallbacks = {
				bg: 'bg-gray-100',
				text: 'text-gray-800',
				hover: 'hover:bg-gray-200',
			}
			return fallbacks[type] || fallbacks.bg
		}
	}

	// Get platform icon for display in select menu
	function getPlatformIcon(platform: string): string {
		if (!platform) return 'i-mdi-link-variant'

		try {
			const platformInfo = platformOptions.find(p => p.value === platform)
			return platformInfo?.icon || 'i-mdi-link-variant'
		} catch (error) {
			console.error('Error retrieving platform icon:', error)
			return 'i-mdi-link-variant'
		}
	}

	/**
	 * Detect platform from URL with performance optimization via memoization
	 * @param url - The URL to detect the platform from
	 * @returns Object containing the platform key and icon
	 */
	function detectPlatform(url: string): {
		platform: PlatformKey
		icon: string
	} {
		// Handle empty URLs safely
		if (!url?.trim()) {
			return { platform: 'other', icon: 'i-mdi-link-variant' }
		}

		try {
			// Normalize the URL for consistent caching
			const normalizedUrl = url.trim().toLowerCase()

			// Check cache first for performance
			if (detectionCache.has(normalizedUrl)) {
				return detectionCache.get(normalizedUrl)!
			}

			// Pre-process URL to ensure proper format for detection
			let processedUrl = normalizedUrl
			if (
				!processedUrl.startsWith('http://') &&
				!processedUrl.startsWith('https://')
			) {
				processedUrl = 'https://' + processedUrl
			}

			// Try to extract the domain for more accurate detection
			let domain = ''
			try {
				const urlObj = new URL(processedUrl)
				domain = urlObj.hostname
			} catch {
				domain = processedUrl
			}

			// Find the first strategy that can handle this URL
			for (const [platform, strategy] of Object.entries(platformStrategies)) {
				if (strategy.canHandle(domain)) {
					const result = strategy.getPlatformDetails()
					// Cache the result for future lookups
					detectionCache.set(normalizedUrl, result)
					return result
				}
			}

			// If no strategy matched, return other
			const defaultResult = {
				platform: 'other' as PlatformKey,
				icon: 'i-mdi-link-variant',
			}
			detectionCache.set(normalizedUrl, defaultResult)
			return defaultResult
		} catch (error) {
			console.error('Error detecting platform:', error)
			return { platform: 'other', icon: 'i-mdi-link-variant' }
		}
	}

	/**
	 * Extracts username from a social media URL if possible
	 * @param url - The social media URL
	 * @param platform - The detected platform
	 * @returns The username or null if not extractable
	 */
	function extractUsername(url: string, platform: PlatformKey): string | null {
		if (!url) return null

		try {
			// Normalize URL
			if (!url.startsWith('http://') && !url.startsWith('https://')) {
				url = 'https://' + url
			}

			const urlObj = new URL(url)
			const path = urlObj.pathname.split('/').filter(Boolean)

			// Platform-specific extraction logic
			switch (platform) {
				case 'twitter':
					return path[0] !== 'hashtag' && path[0] !== 'search'
						? `@${path[0]}`
						: null
				case 'instagram':
				case 'github':
				case 'pinterest':
					return path[0] ? `@${path[0]}` : null
				case 'facebook':
					return path[0] && !['pages', 'groups'].includes(path[0])
						? path[0]
						: null
				default:
					return null
			}
		} catch {
			return null
		}
	}

	/**
	 * Get all supported platforms
	 * @returns Array of platform keys
	 */
	function getSupportedPlatforms(): PlatformKey[] {
		return Object.keys(platformStrategies) as PlatformKey[]
	}

	// Public API
	return {
		platformOptions,
		platformColors,
		getPlatformColor,
		getPlatformIcon,
		detectPlatform,
		extractUsername,
		getSupportedPlatforms,
	}
}
