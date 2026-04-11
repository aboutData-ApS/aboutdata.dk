-- ============================================================
-- aboutData CMS – Supabase Schema
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard
-- ============================================================

-- Enable UUID extension (enabled by default on Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PROFILES (extends Supabase Auth users)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email       TEXT,
  full_name   TEXT,
  role        TEXT NOT NULL DEFAULT 'admin',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ============================================================
-- WEBSITE CONTENT
-- Stores all editable website content as key-value pairs per section
-- ============================================================
CREATE TABLE IF NOT EXISTS public.website_content (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section     TEXT NOT NULL,       -- 'hero' | 'about' | 'services' | 'contact'
  field_key   TEXT NOT NULL,       -- e.g. 'headline', 'body', 'items'
  field_value TEXT,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (section, field_key)
);

CREATE INDEX IF NOT EXISTS idx_website_content_section ON public.website_content(section);

-- ============================================================
-- ANALYTICS EVENTS
-- Tracks page views, CTA clicks, and form submissions
-- ============================================================
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type  TEXT NOT NULL,       -- 'page_view' | 'cta_click' | 'form_submit'
  section     TEXT,                -- which section triggered the event
  page        TEXT NOT NULL DEFAULT '/',
  metadata    JSONB DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON public.analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON public.analytics_events(created_at DESC);

-- ============================================================
-- LEADS (contact form submissions)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.leads (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  message     TEXT,
  status      TEXT NOT NULL DEFAULT 'new',  -- 'new' | 'read' | 'archived'
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT valid_status CHECK (status IN ('new', 'read', 'archived'))
);

CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Profiles: only the user themselves can read/update their own profile
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Website content: only authenticated users can read/write
ALTER TABLE public.website_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read website content"
  ON public.website_content FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can upsert website content"
  ON public.website_content FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update website content"
  ON public.website_content FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Analytics: allow anon inserts (public tracking), authenticated reads
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert analytics events"
  ON public.analytics_events FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read analytics"
  ON public.analytics_events FOR SELECT
  USING (auth.role() = 'authenticated');

-- Leads: allow anon inserts (public contact form), authenticated reads
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit leads"
  ON public.leads FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read leads"
  ON public.leads FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update leads"
  ON public.leads FOR UPDATE
  USING (auth.role() = 'authenticated');
