# Share-Links

Share-Links is a modern, customizable "link-in-bio" web application built with Nuxt.js. It allows
users to create and share a personalized profile page with their social media links and basic
information.

## 🌟 Features

- **User Authentication**: Secure signup, login, and password reset functionality
- **Profile Customization**: Add your name, bio, and profile picture
- **Social Media Management**: Add, edit, and remove links to various social media platforms
- **Automatic Platform Detection**: Automatically detects social platform from URL
- **Username Extraction**: Extracts usernames from social media URLs when possible
- **Form Validation**: Comprehensive validation using Zod schema
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Modern UI**: Built with Nuxt UI components for a clean, modern look
- **Server API**: Built-in server endpoints for authentication and profile management
- **Supabase Integration**: Utilizes Supabase for authentication and data storage
- **Offline Mode**: Continue editing your profile while offline with automatic data synchronization
  when connection is restored

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

Create a `.env` file in the root directory:

```bash
NUXT_PUBLIC_APP_URL=http://localhost:3000
NUXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NUXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

- `NUXT_PUBLIC_APP_URL` must be the exact base URL users open in the browser (no trailing slash). It
  is used in signup and password-reset email links.
- `NUXT_PUBLIC_SUPABASE_ANON_KEY` is the **anon** (public) key from Supabase.
- `SUPABASE_SERVICE_ROLE_KEY` is the **service_role** key and must stay **server-only** (never
  commit it or expose it to the client). The app uses it when an operation needs to bypass RLS.

## 👨‍💻 Author

Created by [Karim Tarek](https://github.com/karimtarek)
