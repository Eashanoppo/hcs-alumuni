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
