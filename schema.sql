-- ==============================================================================
-- HAMMAD'S JOURNAL — DATABASE SCHEMA & ROW LEVEL SECURITY (RLS)
-- ==============================================================================
-- Run this script in your Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- ==============================================================================

-- 1. Create the articles table
CREATE TABLE IF NOT EXISTS public.articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    subtitle TEXT,
    content TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    cover_image TEXT,
    category TEXT DEFAULT 'Perspectives',
    tags TEXT[] DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    published_at TIMESTAMPTZ
);

-- 2. Create performance & search indexes
CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_status ON public.articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON public.articles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON public.articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_category ON public.articles(category);

-- Full-text search index
CREATE INDEX IF NOT EXISTS idx_articles_fts ON public.articles 
USING gin(to_tsvector('english', title || ' ' || COALESCE(excerpt, '') || ' ' || COALESCE(content, '')));

-- 3. Automatic updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_articles_updated_at ON public.articles;
CREATE TRIGGER trigger_articles_updated_at
    BEFORE UPDATE ON public.articles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- 5. Strict RLS Policies
-- A. PUBLIC ACCESS: Anyone can read articles ONLY if their status is 'published'
DROP POLICY IF EXISTS "Public visitors can only view published articles" ON public.articles;
CREATE POLICY "Public visitors can only view published articles" 
ON public.articles 
FOR SELECT 
TO public 
USING (status = 'published');

-- B. ADMIN ACCESS: Authenticated users (Hammad) have full read/insert/update/delete access
DROP POLICY IF EXISTS "Authenticated admin full access" ON public.articles;
CREATE POLICY "Authenticated admin full access" 
ON public.articles 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- 6. Storage Bucket for Cover Images (Optional)
-- In Supabase Dashboard -> Storage -> Create bucket named 'journal-images' with Public access.
