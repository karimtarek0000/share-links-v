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

	// Helper to safely get platform colors with fallback
	function getPlatformColor(
		platform: string | PlatformKey,
		type: keyof PlatformColors,
	): string {
		if (platform in platformColors) {
			return platformColors[platform as PlatformKey][type]
		}
		return platformColors.other[type]
	}

	// Get platform icon for display in select menu
	function getPlatformIcon(platform: string): string {
		if (!platform) return 'i-mdi-link-variant'

		const platformInfo = platformOptions.find(p => p.value === platform)
		return platformInfo?.icon || 'i-mdi-link-variant'
	}

	// Detect platform from URL
	function detectPlatform(url: string): {
		platform: PlatformKey
		icon: string
	} {
		if (!url) return { platform: 'other', icon: 'i-mdi-link-variant' }

		if (url.includes('instagram')) {
			return { platform: 'instagram', icon: 'i-mdi-instagram' }
		} else if (url.includes('twitter') || url.includes('x.com')) {
			return { platform: 'twitter', icon: 'i-mdi-twitter' }
		} else if (url.includes('facebook') || url.includes('fb.com')) {
			return { platform: 'facebook', icon: 'i-mdi-facebook' }
		} else if (url.includes('linkedin')) {
			return { platform: 'linkedin', icon: 'i-mdi-linkedin' }
		} else if (url.includes('youtube') || url.includes('youtu.be')) {
			return { platform: 'youtube', icon: 'i-mdi-youtube' }
		} else if (url.includes('tiktok')) {
			return { platform: 'tiktok', icon: 'i-mdi-music-note' }
		} else if (url.includes('snapchat')) {
			return { platform: 'snapchat', icon: 'i-mdi-snapchat' }
		} else if (url.includes('pinterest')) {
			return { platform: 'pinterest', icon: 'i-mdi-pinterest' }
		} else if (url.includes('github')) {
			return { platform: 'github', icon: 'i-mdi-github' }
		} else if (url.includes('dribbble')) {
			return { platform: 'dribbble', icon: 'i-mdi-dribbble' }
		} else if (url.includes('behance')) {
			return { platform: 'behance', icon: 'i-mdi-behance' }
		} else if (url.includes('medium')) {
			return { platform: 'medium', icon: 'i-mdi-medium' }
		} else if (url.includes('discord')) {
			return { platform: 'discord', icon: 'i-mdi-discord' }
		} else if (url.includes('slack')) {
			return { platform: 'slack', icon: 'i-mdi-slack' }
		} else if (url.includes('telegram')) {
			return { platform: 'telegram', icon: 'i-mdi-telegram' }
		} else if (url.includes('whatsapp')) {
			return { platform: 'whatsapp', icon: 'i-mdi-whatsapp' }
		} else if (url.includes('reddit')) {
			return { platform: 'reddit', icon: 'i-mdi-reddit' }
		} else if (url.includes('twitch')) {
			return { platform: 'twitch', icon: 'i-mdi-twitch' }
		} else if (url.includes('spotify')) {
			return { platform: 'spotify', icon: 'i-mdi-spotify' }
		} else if (url.includes('soundcloud')) {
			return { platform: 'soundcloud', icon: 'i-mdi-soundcloud' }
		} else if (url.includes('vimeo')) {
			return { platform: 'vimeo', icon: 'i-mdi-vimeo' }
		}

		return { platform: 'other', icon: 'i-mdi-link-variant' }
	}

	return {
		platformOptions,
		platformColors,
		getPlatformColor,
		getPlatformIcon,
		detectPlatform,
	}
}
