SELECT column_name 
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'teachers'
ORDER BY ordinal_position;
ALTER TABLE public.teachers RENAME COLUMN full_name TO full_name_en;
ALTER TABLE public.teachers RENAME COLUMN joining_year TO joining_date;
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS full_name_bn TEXT;
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS full_name_bn TEXT;
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;
CREATE TABLE IF NOT EXISTS public.teachers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name_en TEXT NOT NULL,
    full_name_bn TEXT,
    designation TEXT NOT NULL,
    subject TEXT NOT NULL,
    joining_date TEXT NOT NULL,
    leaving_year TEXT NOT NULL,
    photo_url TEXT,
    education JSONB DEFAULT '[]',
    present_address TEXT,
    mobile TEXT NOT NULL,
    email TEXT,
    current_occupation TEXT,
    willing_to_attend TEXT DEFAULT 'হ্যাঁ' CHECK (willing_to_attend IN ('হ্যাঁ', 'না', 'সম্ভবত')),
    activities JSONB DEFAULT '[]',
    memory_note TEXT,
    consent BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    teacher_id TEXT UNIQUE,
    slug TEXT UNIQUE,
    is_founder_guide BOOLEAN DEFAULT FALSE,
    founder_guide_note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Teachers public insert" ON public.teachers FOR INSERT WITH CHECK (true);
CREATE POLICY "Teachers public read approved" ON public.teachers FOR SELECT USING (status = 'APPROVED');
