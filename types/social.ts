// Declare types and interfaces globally
export {} // Ensure this file is treated as a module

declare global {
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

	type PlatformKey =
		| 'instagram'
		| 'twitter'
		| 'facebook'
		| 'linkedin'
		| 'youtube'
		| 'tiktok'
		| 'snapchat'
		| 'pinterest'
		| 'github'
		| 'dribbble'
		| 'behance'
		| 'medium'
		| 'discord'
		| 'slack'
		| 'telegram'
		| 'whatsapp'
		| 'reddit'
		| 'twitch'
		| 'spotify'
		| 'soundcloud'
		| 'vimeo'
		| 'other'

	interface PlatformOption {
		value: PlatformKey
		label: string
		icon: string
	}
}
