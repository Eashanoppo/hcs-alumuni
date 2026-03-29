-- HCS Alumni Registration Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create Registrants Table
CREATE TABLE IF NOT EXISTS public.registrants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name_en TEXT NOT NULL,
    full_name_bn TEXT,
    father_name TEXT NOT NULL,
    mother_name TEXT NOT NULL,
    dob TEXT NOT NULL,
    present_address TEXT NOT NULL,
    permanent_address TEXT,
    photo_url TEXT,
    occupation TEXT NOT NULL,
    alumni_number TEXT UNIQUE,
    admission_year TEXT NOT NULL,
    admission_class TEXT NOT NULL,
    leaving_year TEXT NOT NULL,
    leaving_class TEXT NOT NULL,
    certificate TEXT CHECK (certificate IN ('PESC', 'JSC', 'SSC')),
    ssc_batch TEXT,
    school_photo_url TEXT,
    batch TEXT,
    house TEXT,
    certificate_url TEXT,
    mobile TEXT NOT NULL,
    email TEXT NOT NULL,
    whatsapp TEXT,
    facebook_url TEXT,
    instagram_url TEXT,
    workplace TEXT,
    current_institution TEXT,
    attending BOOLEAN DEFAULT FALSE,
    guests_count INTEGER DEFAULT 0,
    spouse_attending BOOLEAN DEFAULT FALSE,
    children_count INTEGER DEFAULT 0,
    tshirt_size TEXT CHECK (tshirt_size IN ('S', 'M', 'L', 'XL', 'XXL')),
    registration_status TEXT DEFAULT 'PENDING' CHECK (registration_status IN ('PENDING', 'PAID', 'APPROVED', 'REJECTED')),
    payment_status TEXT DEFAULT 'UNPAID' CHECK (payment_status IN ('UNPAID', 'VERIFYING', 'PAID')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Payments Table
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    registrant_id UUID REFERENCES public.registrants(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    method TEXT CHECK (method IN ('BKASH', 'NAGAD', 'CASH')),
    transaction_id TEXT UNIQUE NOT NULL,
    sender_number TEXT NOT NULL,
    status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'VERIFIED', 'FAILED')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable RLS (Row Level Security)
ALTER TABLE public.registrants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- 4. Create Policies (Public Access for MVP - Adjust as needed)
-- Registrants: Anyone can insert, admins can read/all
CREATE POLICY "Allow public insert" ON public.registrants FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read approved" ON public.registrants FOR SELECT USING (registration_status = 'APPROVED');
CREATE POLICY "Allow service_role full access" ON public.registrants USING (true) WITH CHECK (true);

-- Payments: Only service_role handles these for security
CREATE POLICY "Allow public insert payments" ON public.payments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow service_role full access payments" ON public.payments USING (true) WITH CHECK (true);

-- 5. Helper Function for Alumni Directory (Security check for logins)
CREATE OR REPLACE FUNCTION check_alumni_login(p_mobile TEXT, p_dob TEXT)
RETURNS SETOF public.registrants AS $$
BEGIN
    RETURN QUERY 
    SELECT * FROM public.registrants 
    WHERE mobile = p_mobile AND dob = p_dob;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Notices table
CREATE TABLE IF NOT EXISTS public.notices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    title_bn TEXT,
    body TEXT,
    category TEXT DEFAULT 'General',
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read notices" ON public.notices FOR SELECT USING (true);
CREATE POLICY "Service role full access notices" ON public.notices USING (true) WITH CHECK (true);

-- Gallery table
CREATE TABLE IF NOT EXISTS public.gallery (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    title_bn TEXT,
    tag TEXT DEFAULT 'General',
    image_url TEXT NOT NULL,
    size TEXT DEFAULT 'small' CHECK (size IN ('small', 'wide', 'large')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read gallery" ON public.gallery FOR SELECT USING (true);
CREATE POLICY "Service role full access gallery" ON public.gallery USING (true) WITH CHECK (true);

ALTER TABLE public.notices
  ADD COLUMN IF NOT EXISTS body_bn TEXT,
  ADD COLUMN IF NOT EXISTS highlights JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS attachment_url TEXT,
  ADD COLUMN IF NOT EXISTS attachment_name TEXT,
  ADD COLUMN IF NOT EXISTS action_label TEXT,
  ADD COLUMN IF NOT EXISTS action_url TEXT;

  -- Create table for Videos
CREATE TABLE public.videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  video_url TEXT NOT NULL,
  platform TEXT NOT NULL, -- 'youtube' or 'facebook'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Create table for About Page Milestones
CREATE TABLE public.milestones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  year TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Create table for About Page Content (Mission, Vision, Headmaster)
CREATE TABLE public.about_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section TEXT UNIQUE NOT NULL, -- 'mission', 'vision', 'headmaster'
  title TEXT,
  content TEXT,
  image_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Insert default about content to prevent empty page initially
INSERT INTO public.about_content (section, title, content) VALUES
('mission', 'আমাদের লক্ষ্য', 'আমাদের লক্ষ্য হলো প্রতিটি শিক্ষার্থীকে সুশিক্ষায় শিক্ষিত করে তোলা এবং তাদের সৃজনশীল প্রতিভার বিকাশ ঘটানো।'),
('vision', 'আমাদের উদ্দেশ্য', 'আধুনিক শিক্ষার সাথে নৈতিক মূল্যবোধের সমন্বয় ঘটিয়ে এমন একটি প্রজন্ম গড়ে তোলা যারা আগামীর নেতৃত্ব দিবে।'),
('headmaster', 'শিক্ষাই আলো, শিক্ষার আলো ছড়িয়ে পড়ুক সবার মাঝে।', '২৫ বছরের এই পথচলায় আপনারা যেভাবে আমাদের পাশে ছিলেন, আশা করি আগামীদিনেও সেভাবেই আপনাদের সমর্থন অব্যাহত থাকবে। আমরা প্রতিটি শিক্ষার্থীর নৈতিক উন্নয়ন ও চারিত্রিক গঠনের ওপর গুরুত্বারোপ করি।');
-- Allow public read access to the tables
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access on videos" ON public.videos FOR SELECT USING (true);
CREATE POLICY "Allow public read access on milestones" ON public.milestones FOR SELECT USING (true);
CREATE POLICY "Allow public read access on about_content" ON public.about_content FOR SELECT USING (true);
-- (Admin insert/update/delete usually bypasses RLS if you're using the service_role key, 
-- which the admin panel in this repository uses `getAdminSupabase()`.)
-- 1. Add image support to milestones
ALTER TABLE public.milestones ADD COLUMN IF NOT EXISTS image_url TEXT;
-- 2. Convert 'attending' from BOOLEAN to TEXT to support 'Probably'
ALTER TABLE public.registrants ALTER COLUMN attending DROP DEFAULT;
ALTER TABLE public.registrants ALTER COLUMN attending TYPE TEXT USING (CASE WHEN attending=TRUE THEN 'yes' ELSE 'no' END);
-- 3. Add volunteer status field
ALTER TABLE public.registrants ADD COLUMN IF NOT EXISTS volunteer_status BOOLEAN DEFAULT FALSE;

-- 10. Create table for Visions (Our Vision Cards)
CREATE TABLE IF NOT EXISTS public.visions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Create table for Testimonials (Voice of Alumni)
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  batch TEXT NOT NULL,
  quote TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Allow public read access on new tables
ALTER TABLE public.visions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on visions" ON public.visions FOR SELECT USING (true);
CREATE POLICY "Allow public read access on testimonials" ON public.testimonials FOR SELECT USING (true);
-- Service role full access via getAdminSupabase() handles writes

