# aboutData CMS – Setup Guide

## Prerequisites
- Node.js 18+
- A Supabase project
- An Anthropic API key

---

## 1. Install dependencies

```bash
cd cms
npm install
```

---

## 2. Configure environment variables

Copy the example file and fill in your keys:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

Get your Supabase keys from:  
**Supabase Dashboard → Project Settings → API**

Get your Anthropic key from:  
**console.anthropic.com → API Keys**

---

## 3. Set up the database

In your Supabase dashboard, go to **SQL Editor** and run:

1. `supabase/schema.sql` – creates all tables and RLS policies
2. `supabase/seed.sql` – populates with example content and analytics data

---

## 4. Create an admin user

In Supabase Dashboard → **Authentication → Users → Add user**

Create a user with your email and a strong password.

---

## 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) and log in with your admin credentials.

---

## Project Structure

```
cms/
├── app/
│   ├── (auth)/login/          # Login page
│   ├── (dashboard)/           # Protected dashboard pages
│   │   ├── page.tsx           # Dashboard overview
│   │   ├── editor/            # Website content editor
│   │   ├── analytics/         # Analytics & leads
│   │   └── settings/          # Settings page
│   ├── api/ai/improve/        # Claude AI endpoint
│   └── globals.css
├── components/
│   ├── sidebar/               # Navigation sidebar
│   ├── editor/                # Section-specific editors
│   │   ├── HeroEditor.tsx
│   │   ├── AboutEditor.tsx
│   │   ├── ServicesEditor.tsx
│   │   └── ContactEditor.tsx
│   ├── ai/                    # AI action button + modal
│   ├── analytics/             # Recharts components
│   └── preview/               # Live website preview
├── lib/
│   ├── supabase/              # Supabase client (browser + server)
│   ├── content.ts             # Content fetching helpers
│   └── utils.ts
├── types/index.ts             # All TypeScript types
├── supabase/
│   ├── schema.sql             # Full database schema + RLS
│   └── seed.sql               # Sample data
└── middleware.ts              # Auth protection
```

---

## Features

### CMS Editor
- Edit all website sections via structured forms
- Each text field has an **AI button** with 4 actions:
  - Forbedre klarhed (Improve clarity)
  - Gøre professionel (Make professional)
  - Salgsorienteret (Sales-focused)
  - Gøre kortere (Shorten)
- AI generates 3 variations; user picks one
- Live preview updates after saving

### Analytics
- Page views, CTA clicks, form submissions tracked
- 7-day charts (area + bar)
- Leads table with status management

### Auth
- Supabase Auth with email/password
- All dashboard routes protected via middleware
- Auto-redirect to login if not authenticated

---

## Deploying to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# or: vercel env add ANTHROPIC_API_KEY
```

Add all 4 environment variables in **Vercel → Project → Settings → Environment Variables**.
