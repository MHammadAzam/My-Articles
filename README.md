# Hammad's Journal — Personal Article Publishing Platform

> "Thoughts, Ideas & Perspectives."
> *A personal space for exploring ideas, questioning perspectives, and sharing observations about the world around us.*

**Hammad's Journal** is an independent digital publication built with Next.js, TypeScript, Tailwind CSS, TipTap, and Supabase PostgreSQL. Inspired by the editorial elegance of Substack and Medium, it delivers a comfortable reading experience for visitors and a private writing studio for its author, Hammad Azam.

---

## Architecture & Distinct Experiences

The application strictly separates the public reading realm from the private writing studio:

1. **Public Publication (Universal Access):**
   - Accessible by anyone in the world without creating an account or providing API keys.
   - **Homepage (`/`)**: Hero introduction, curated featured essays, latest reflections, author preview, and minimal footer.
   - **My Articles (`/articles`)**: Archive with instant search and category filters. Displays articles in a 2-column responsive grid with subtle 3D hover perspective.
   - **Individual Article Page (`/articles/[slug]`)**: Dedicated Substack-inspired reading column (~720px max width), serif typography, formatted headers, blockquotes, lists, images, and author signature line. Direct URL accessible from WhatsApp, LinkedIn, or external links with OpenGraph previews.
   - **About Page (`/about`)**: "A Little About Me" personal preface.
   - **Zero Timestamps Policy**: In accordance with the editorial design, publication dates, updated timestamps, and reading times are never displayed anywhere on public pages.
   - **Strict Visibility Boundary**: No write, admin, draft, or login buttons are ever rendered to public readers.

2. **Private Administrative Studio (`/admin`):**
   - Exclusively for Hammad. Protected by server-side authentication and session verification.
   - **Overview (`/admin`)**: Metrics on published works, active drafts, quick write action, and recently modified pieces.
   - **All Articles (`/admin/articles`)**: Complete management table with tabs for All, Published, and Drafts. Allows toggling publish/unpublish status, editing, copying shareable public links, and deletion with modal confirmation.
   - **Writing Studio (`/admin/write`)**: Distraction-free TipTap editor supporting H1, H2, H3, paragraphs, bold, italic, underline, bullet lists, numbered lists, blockquotes, hyperlinks, images, undo/redo, and clear formatting. Flawlessly preserves formatting when pasting from ChatGPT or MS Word.
   - **Article Editor (`/admin/edit/[id]`)**: Full editing capabilities that update existing database records without creating duplicates.
   - **Settings (`/admin/settings`)**: Cloud database connection status and step-by-step Supabase configuration guide.

---

## Technology Stack

- **Framework**: Next.js 16 (App Router) with TypeScript
- **Styling**: Tailwind CSS v4 with custom editorial variables & 3D perspective transforms
- **Typography**: Google Fonts (`Newsreader` for headings, `Source Serif 4` for essay body, `Inter` for UI)
- **Rich-Text Editor**: TipTap (`@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-link`, `@tiptap/extension-image`, `@tiptap/extension-underline`, `@tiptap/extension-placeholder`)
- **Database & Auth**: Supabase PostgreSQL with Row Level Security (RLS) policies and Supabase Auth
- **Icons**: Lucide React
- **Zero AI Dependencies**: 100% free of paid API keys or recurring third-party subscriptions.

---

## Quick Start & Local Development

### 1. Install dependencies
```bash
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Default local credentials:
- **Author Email**: `hammad@journal.com`
- **Password**: `HammadJournal2026!`

*(You can customize these in `.env.local`)*

### 3. Run the development server
```bash
npm run dev
```

Visit:
- Public Publication: [http://localhost:3000](http://localhost:3000)
- Private Admin Studio: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## Supabase Cloud Database Setup (100% Free)

When you are ready to connect to your live Supabase database for production:

1. **Create Project**: Go to [supabase.com](https://supabase.com) and create a free project.
2. **Run SQL Schema**:
   - In your Supabase Dashboard, open **SQL Editor** -> **New Query**.
   - Copy the entire contents of [`schema.sql`](./schema.sql) and click **Run**.
   - This provisions the `articles` table, performance indexes, full-text search index, automated `updated_at` triggers, and Row Level Security (RLS) policies.
3. **Copy API Keys**:
   - In Supabase Dashboard, go to **Project Settings -> API**.
   - Copy your **Project URL** and **anon / public key**.
4. **Update `.env.local`** (or your Vercel deployment variables):
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ADMIN_EMAIL=hammad@journal.com
   ADMIN_PASSWORD=your-secure-password
   NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
   ```

### Row Level Security (RLS) Guarantees
- **Public Readers**: Can `SELECT` records strictly when `status = 'published'`. Drafts and administrative actions are rejected at the database level.
- **Admin**: Has full `ALL` (insert, update, delete, view drafts) permissions when authenticated.

---

## Automated Verification Suite

Run the full end-to-end verification test suite:

```bash
npm run test:platform
```

Tests verify:
- Homepage rendering, exact headings, and supporting descriptions.
- Absence of admin buttons or controls on public pages.
- Absolute enforcement of the Zero Dates / Timestamps / Reading Times policy.
- About page text preservation and absence of corporate resume information.
- Direct URL loading of individual essays.
- Redirection of unauthorized visitors from `/admin` to `/admin/login`.
- Rejection of unauthenticated POST/PUT/DELETE requests with 401 Unauthorized.
- Draft creation and confirmation of draft invisibility on public routes.
- Publishing workflow and appearance on public archives.
- Editing existing records without duplication.
- Unpublishing workflow and immediate 404 response to public requests.
- Complete deletion with confirmation.
- `robots.txt` and `sitemap.xml` SEO generation.

---

## Deploying to Vercel (Free Tier)

1. Push this repository to GitHub.
2. Import the repository in [vercel.com](https://vercel.com).
3. Add the environment variables from your `.env.local` in the Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
   - `NEXT_PUBLIC_SITE_URL`
4. Click **Deploy**. Vercel will build and assign a permanent HTTPS URL.

---

## License

© Hammad Azam. Hammad's Journal. All rights reserved.
