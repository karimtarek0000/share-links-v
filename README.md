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

Create a `.env` file in the root directory:

```bash
NUXT_PUBLIC_APP_URL=http://localhost:3000
NUXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NUXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

- `NUXT_PUBLIC_APP_URL` must be the exact base URL users open in the browser (no trailing slash). It is used in signup and password-reset email links.
- `NUXT_PUBLIC_SUPABASE_ANON_KEY` is the **anon** (public) key from Supabase.
- `SUPABASE_SERVICE_ROLE_KEY` is the **service_role** key and must stay **server-only** (never commit it or expose it to the client). The app uses it when an operation needs to bypass RLS.

### Supabase dashboard setup

Do this in the [Supabase Dashboard](https://supabase.com/dashboard) for your project.

#### 1. API keys and project URL

1. Open **Project Settings → API**.
2. Copy **Project URL** → `NUXT_PUBLIC_SUPABASE_URL`.
3. Copy **anon public** key → `NUXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Copy **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (keep secret).

#### 2. Authentication URLs and email

1. Open **Authentication → URL configuration**.
2. Set **Site URL** to your app base URL (same idea as `NUXT_PUBLIC_APP_URL`, e.g. `http://localhost:3000` in development or your production domain).
3. Under **Redirect URLs**, add at least:
   - `{YOUR_APP_URL}/auth/login`
   - `{YOUR_APP_URL}/auth/login/`
   - `{YOUR_APP_URL}/auth/reset-password`
   - `{YOUR_APP_URL}/auth/reset-password/`
4. The app sends users to these paths with query strings after email actions:
   - After **signup confirmation**: `{YOUR_APP_URL}/auth/login/?confirmEmail=true`
   - After **password reset**: `{YOUR_APP_URL}/auth/reset-password/?resetPassword=true`  
   Wildcards are allowed in Supabase redirect settings (e.g. `https://yourdomain.com/**`) if you prefer one entry for all auth routes.
5. Under **Authentication → Providers**, ensure **Email** is enabled (this app uses email/password).
6. Optional: under **Authentication → Email**, adjust templates; links will use your **Site URL** and **Redirect URLs** settings.

#### 3. Database: `profiles` table and RLS

The app reads and writes the `public.profiles` table with these columns:

| Column         | Type    | Notes |
|----------------|---------|--------|
| `user_id`      | `uuid`  | Primary key; must match `auth.users.id`. |
| `name`         | `text`  | Display name. |
| `bio`          | `text`  | Short bio. |
| `img`          | `text`  | Nullable; public image URL (from Storage). |
| `social_links` | `text[]`| Array of strings (social URLs), not JSON. |

Run this in **SQL Editor** (adjust only if you already have a conflicting table):

```sql
create table if not exists public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  name text not null,
  bio text not null,
  img text,
  social_links text[] not null default '{}'::text[]
);

alter table public.profiles enable row level security;

-- Profile GET uses the anon key with no user session: rows must be readable publicly
create policy "profiles_select_public"
  on public.profiles for select
  to anon, authenticated
  using (true);

create policy "profiles_insert_own"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

grant select on public.profiles to anon, authenticated;
grant insert, update on public.profiles to authenticated;
```

If your project restricts which tables are exposed to the Data API, ensure `profiles` is allowed for the `anon` and `authenticated` roles (see [Securing your API](https://supabase.com/docs/guides/api/securing-your-api)).

##### Signup: `Database error saving new user`

This message is returned by Supabase Auth when **creating the row in `auth.users` succeeds** but something in the database fails afterward. Very often there is an **`AFTER INSERT` trigger on `auth.users`** that copies the user into `public.profiles`. If that `INSERT` fails (wrong columns, **`NOT NULL` violations**, type mismatch such as **`social_links` as `jsonb` instead of `text[]`**, or duplicate `user_id`), signup fails with this generic message.

This app **does not** create the profile row during signup; users create it later via `/api/profile/add` after signing in and filling the profile form. You **do not need** a signup trigger.

1. Open **Reports → Postgres logs** or **Logs** in the Dashboard and reproduce signup; Postgres usually logs the concrete error (constraint name, failing column).
2. In the SQL Editor run:

```sql
select tgname as trigger_name, pg_get_triggerdef(oid) as definition
from pg_trigger t
join pg_class c on c.oid = t.tgrelid
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'auth'
  and c.relname = 'users'
  and not t.tgisinternal;
```

3. If you see triggers like `on_auth_user_created` and you copied them from tutorials, either **drop the trigger** (recommended for this codebase) or **fix the trigger function** so it inserts every **`NOT NULL`** column on `public.profiles` with valid values and **`social_links` as `'{}'::text[]`**, not `{}` as JSON.

To remove a tutorial trigger (adjust names from `pg_get_triggerdef`):

```sql
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();
```

If you still want an automatic starter row when a user signs up, replace your function with something that matches this project’s **`profiles`** columns (defaults satisfy `NOT NULL`; name falls back from `raw_user_meta_data`):

```sql
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, name, bio, img, social_links)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data->>'name'), ''), 'Member'),
    'Edit your profile to add a short bio (minimum 10 characters).',
    null,
    '{}'::text[]
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
```

#### 4. Storage: bucket `profile-images`

Uploads use bucket id **`profile-images`** (must match exactly). The app uses **public URLs** for avatars.

**Do not** add a blanket `SELECT` on `storage.objects` for `anon` or `public` for this bucket: that lets clients **list every object path** via the Storage API. With a **public** bucket, visitors can still open each image by **URL**; they do not need an RLS `SELECT` policy for that.

1. Open **Storage → New bucket**.
2. **Name**: `profile-images`.
3. Turn **Public bucket** **on**.
4. Add policies so authenticated users manage only objects under `{their_user_id}/...`:

```sql
-- If the bucket was created in the UI, skip the insert into storage.buckets.
insert into storage.buckets (id, name, public)
values ('profile-images', 'profile-images', true)
on conflict (id) do update set public = excluded.public;

-- Optional: remove an old overly-broad policy if you added it earlier
-- drop policy if exists "profile_images_select_public" on storage.objects;

-- SELECT only inside your own folder (needed for Storage upsert = insert + update)
create policy "profile_images_select_own_folder"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'profile-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "profile_images_insert_own_folder"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'profile-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "profile_images_update_own_folder"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'profile-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'profile-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "profile_images_delete_own_folder"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'profile-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
```

The app uploads paths like `{user_uuid}/{timestamp}.{ext}`, so the first path segment must equal the authenticated user id.

After configuration, restart the dev server so Nuxt picks up `.env` changes.

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
