# Share-Links

Share-Links is a modern, customizable "link-in-bio" web application built with
Nuxt.js. It allows users to create and share a personalized profile page with
their social media links and basic information.

## 🌟 Features

- **User Authentication**: Secure signup, login, and password reset
  functionality
- **Profile Customization**: Add your name, bio, and profile picture
- **Social Media Management**: Add, edit, and remove links to various social
  media platforms
- **Automatic Platform Detection**: Automatically detects social platform from
  URL
- **Username Extraction**: Extracts usernames from social media URLs when
  possible
- **Form Validation**: Comprehensive validation using Zod schema
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Modern UI**: Built with Nuxt UI components for a clean, modern look
- **Server API**: Built-in server endpoints for authentication and profile
  management
- **Supabase Integration**: Utilizes Supabase for authentication and data
  storage

## 📋 Prerequisites

- Node.js 16.x or later
- npm, yarn, pnpm, or bun
- Supabase account (for authentication and data storage)

## 🚀 Installation

Clone the repository and install dependencies:

```bash
# Clone the repository
git clone https://github.com/karimtarek0000/share-links.git
cd share-links

# Install dependencies
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

## 💻 Development

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# yarn
yarn dev

# pnpm
pnpm dev

# bun
bun run dev
```

## 🏗️ Build for Production

Build the application for production:

```bash
# npm
npm run build

# yarn
yarn build

# pnpm
pnpm build

# bun
bun run build
```

Preview the production build:

```bash
# npm
npm run preview

# yarn
yarn preview

# pnpm
pnpm preview

# bun
bun run preview
```

## 🧰 Tech Stack

- [Nuxt 3](https://nuxt.com/) - Vue.js Framework
- [Vue 3](https://vuejs.org/) - Progressive JavaScript Framework
- [TypeScript](https://www.typescriptlang.org/) - JavaScript with syntax for
  types
- [Nuxt UI](https://ui.nuxt.com/) - UI component library for Nuxt
- [Zod](https://github.com/colinhacks/zod) - TypeScript-first schema validation
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Supabase](https://supabase.io/) - Open source Firebase alternative

## 📁 Project Structure

```
├── app.vue              # Main application entry point
├── app.config.ts        # Application configuration
├── nuxt.config.ts       # Nuxt configuration
├── components/          # Vue components
│   ├── AppHeader.vue    # Application header
│   ├── Logo.vue         # Logo component
│   └── profile/         # Profile-related components
│       ├── ProfileForm.vue    # Form for editing profile
│       └── ProfilePreview.vue # Preview of current profile
├── composables/         # Vue composables (hooks)
│   ├── useAuthApi.ts         # Authentication API utilities
│   ├── useFormValidation.ts  # Form validation utilities
│   ├── useProfileApi.ts      # Profile API utilities
│   ├── useProfileForm.ts     # Profile form state and methods
│   ├── useServerSupabase.ts  # Server-side Supabase utilities
│   ├── useSocialPlatforms.ts # Social platform utilities
│   └── useSupabase.ts        # Client-side Supabase utilities
├── layouts/             # Page layouts
│   ├── auth.vue         # Layout for authentication pages
│   └── default.vue      # Default layout for other pages
├── middleware/          # Route middleware
│   └── auth.ts          # Authentication middleware
├── pages/               # Application routes
│   ├── index.vue        # Home page
│   ├── auth/            # Authentication pages
│   │   ├── forgot-password.vue  # Password recovery page
│   │   ├── login.vue            # Login page
│   │   ├── reset-password.vue   # Reset password page
│   │   └── signup.vue           # Signup page
│   └── profile/         # Profile pages
│       └── [userid].vue # Dynamic user profile page
├── server/              # Server API endpoints
│   ├── api/             # API routes
│   │   ├── auth/        # Authentication endpoints
│   │   └── profile/     # Profile management endpoints
│   ├── middleware/      # Server middleware
│   └── utils/           # Server utilities
├── validation/          # Schema validation
│   ├── authSchema.ts        # Auth form validation schemas
│   ├── profileSchema.ts     # Profile form validation schemas
│   └── profileTableSchema.ts # Profile database schemas
└── types/               # TypeScript type definitions
    └── social.ts        # Social media related types
```

## 📱 Supported Social Platforms

- Instagram
- Twitter
- Facebook
- LinkedIn
- YouTube
- TikTok
- Snapchat
- Pinterest
- GitHub
- Dribbble
- Behance
- Medium
- Discord
- Slack
- Telegram
- WhatsApp
- Reddit
- Twitch
- Spotify
- SoundCloud
- Vimeo
- Other custom links

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for
details.

## 👨‍💻 Author

Created by [Karim Tarek](https://github.com/karimtarek)

---

Last updated: April 15, 2025

Made with ❤️ using [Nuxt 3](https://nuxt.com)
