-- 1. Profiles Table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Bakeries Table
CREATE TABLE public.bakeries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    address TEXT,
    city TEXT NOT NULL,
    district TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    phone TEXT,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Reviews Table
CREATE TABLE public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bakery_id UUID REFERENCES public.bakeries(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT,
    review_text TEXT NOT NULL,
    egg_rating INTEGER NOT NULL CHECK (egg_rating >= 0 AND egg_rating <= 10),
    taste_rating INTEGER NOT NULL CHECK (taste_rating >= 0 AND taste_rating <= 10),
    freshness_rating INTEGER NOT NULL CHECK (freshness_rating >= 0 AND freshness_rating <= 10),
    price_rating INTEGER NOT NULL CHECK (price_rating >= 0 AND price_rating <= 10),
    scam_level INTEGER NOT NULL CHECK (scam_level >= 0 AND scam_level <= 10),
    overall_rating NUMERIC GENERATED ALWAYS AS (
        ((egg_rating * 0.35) + (taste_rating * 0.25) + (freshness_rating * 0.20) + (price_rating * 0.20)) - (scam_level * 0.1)
    ) STORED,
    price_paid NUMERIC,
    visited_at DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Review Photos Table
CREATE TABLE public.review_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    review_id UUID REFERENCES public.reviews(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    cloudinary_url TEXT NOT NULL,
    cloudinary_public_id TEXT,
    width INTEGER,
    height INTEGER,
    file_size INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Bakery Badges Table
CREATE TABLE public.bakery_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bakery_id UUID REFERENCES public.bakeries(id) ON DELETE CASCADE NOT NULL,
    badge_type TEXT NOT NULL,
    label TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bakeries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bakery_badges ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES

-- Profiles
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile." ON public.profiles
    FOR UPDATE USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Bakeries
CREATE POLICY "Bakeries are viewable by everyone." ON public.bakeries
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create bakeries." ON public.bakeries
    FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = created_by);

CREATE POLICY "Only creators can update bakeries." ON public.bakeries
    FOR UPDATE USING (auth.uid() = created_by)
    WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Only creators can delete bakeries." ON public.bakeries
    FOR DELETE USING (auth.uid() = created_by);

-- Reviews
CREATE POLICY "Reviews are viewable by everyone." ON public.reviews
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create reviews." ON public.reviews
    FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews." ON public.reviews
    FOR UPDATE USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews." ON public.reviews
    FOR DELETE USING (auth.uid() = user_id);

-- Review Photos
CREATE POLICY "Review photos are viewable by everyone." ON public.review_photos
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can add photos to reviews." ON public.review_photos
    FOR INSERT WITH CHECK (
        auth.role() = 'authenticated'
        AND auth.uid() = user_id
        AND EXISTS (
            SELECT 1 FROM public.reviews
            WHERE reviews.id = review_photos.review_id
            AND reviews.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete their own photos." ON public.review_photos
    FOR DELETE USING (auth.uid() = user_id);

-- Bakery Badges
CREATE POLICY "Badges are viewable by everyone." ON public.bakery_badges
    FOR SELECT USING (true);

-- Functions & Triggers
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_bakery_updated_at
BEFORE UPDATE ON public.bakeries
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();
