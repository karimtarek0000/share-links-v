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
- **Offline Mode**: Continue editing your profile while offline with automatic
  data synchronization when connection is restored

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

## 🔧 Configuration

Create a `.env` file in the root directory with your Supabase credentials:

```
NUXT_PUBLIC_SUPABASE_URL=your-supabase-url
NUXT_PUBLIC_SUPABASE_KEY=your-supabase-anon-key
NUXT_SUPABASE_SERVICE_KEY=your-supabase-service-key
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
├── assets/              # Static assets
│   └── css/             # CSS files
│       └── main.css     # Main stylesheet
├── components/          # Vue components
│   ├── AppHeader.vue    # Application header
│   ├── Logo.vue         # Logo component
│   └── profile/         # Profile-related components
│       ├── ProfileForm.vue    # Form for editing profile
│       └── ProfilePreview.vue # Preview of current profile
├── composables/         # Vue composables (hooks)
│   ├── useAuthApi.ts         # Authentication API utilities
│   ├── useFormValidation.ts  # Form validation utilities
│   ├── useOfflineMode.ts     # Offline mode functionality
│   ├── useProfileApi.ts      # Profile API utilities
│   ├── useProfileForm.ts     # Profile form state and methods
│   ├── useServerSupabase.ts  # Server-side Supabase utilities
│   ├── useSocialPlatforms.ts # Social platform utilities
│   └── useSupabase.ts        # Client-side Supabase utilities
├── layouts/             # Page layouts
│   ├── auth.vue         # Layout for authentication pages
│   ├── default.vue      # Default layout for other pages
│   └── preview.vue      # Preview layout for profile preview
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
├── public/              # Public static assets
│   ├── favicon.ico      # Site favicon
│   └── robots.txt       # Robots file for SEO
├── server/              # Server API endpoints
│   ├── api/             # API routes
│   │   ├── auth/        # Authentication endpoints
│   │   │   ├── forgot-password.post.ts # Password reset request
│   │   │   ├── login.post.ts           # User login
│   │   │   ├── logout.post.ts          # User logout
│   │   │   └── signup.post.ts          # User registration
│   │   └── profile/     # Profile management endpoints
│   │       ├── add.post.ts          # Create profile
│   │       ├── delete-image.delete.ts # Delete profile image
│   │       ├── get.get.ts           # Get profile data
│   │       ├── update.put.ts        # Update profile
│   │       └── upload-image.post.ts # Upload profile image
│   ├── middleware/      # Server middleware
│   │   └── supabase-auth.ts # Supabase auth middleware
│   └── utils/           # Server utilities
│       └── supabase.ts  # Supabase server connection
├── validation/          # Schema validation
│   ├── authSchema.ts    # Auth form validation schemas
│   └── profileSchema.ts # Profile form validation schemas
└── types/               # TypeScript type definitions
    └── social.ts        # Social media related types
```

## ⚡ Offline Mode Details

The application includes a robust offline mode functionality:

- **Local Storage**: Profile data is cached in the browser's local storage when
  a user is editing
- **Automatic Synchronization**: Changes made offline are automatically
  synchronized when the internet connection is restored
- **Conflict Resolution**: Smart conflict resolution strategy when local and
  remote data differ
- **Offline Indicator**: Visual indication to users when they're working offline
- **Background Sync**: Uses the Background Sync API (when available) to ensure
  data is saved even if the user closes the tab while offline

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

Last updated: April 17, 2025

Made with ❤️ using [Nuxt 3](https://nuxt.com)
