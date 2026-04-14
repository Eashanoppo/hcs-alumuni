import { supabase } from "./supabase";
import { getAdminSupabase } from "./supabase-admin";

export interface TeacherEducation {
  level: string;
  institution: string;
  subject: string;
}

export interface TeacherRecord {
  id?: string;
  full_name_en: string;
  full_name_bn?: string;
  designation: string;
  subject: string;
  joining_date: string;
  leaving_year: string;
  slug?: string;
  photo_url: string | null;
  education: TeacherEducation[];
  present_address: string;
  mobile: string;
  email: string | null;
  facebook_url?: string;
  current_occupation: string | null;
  current_institution?: string;
  willing_to_attend: string;
  activities: string[];
  memory_note: string | null;
  consent: boolean;
  status?: string;
  teacher_id?: string;
  is_founder_guide?: boolean;
  founder_guide_note?: string;
  created_at?: string;
}

export async function submitTeacherRegistration(data: TeacherRecord) {
  // Generate Slug
  const baseSlug = (data.full_name_en || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  let finalSlug = baseSlug;
  
  // Use service role to bypass RLS for slug uniqueness check (anon can't read non-approved rows)
  const adminClient = getAdminSupabase()
  const { data: existing } = await adminClient.from('teachers').select('id').eq('slug', baseSlug);
  if (existing && existing.length > 0) {
    const subjectSlug = (data.subject || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    finalSlug = `${baseSlug}-${subjectSlug}`;
  }

  const { data: result, error } = await supabase
    .from("teachers")
    .insert([{
      ...data,
      slug: finalSlug,
      education: JSON.stringify(data.education),
      activities: JSON.stringify(data.activities)
    }])
    .select()
    .single();

  if (error) throw error;
  return result;
}

export async function getTeacherByCredentials(mobile: string, joining_date: string) {
  // Use service role to bypass RLS so teachers can log in regardless of approval status
  const adminClient = getAdminSupabase()
  const { data, error } = await adminClient
    .from('teachers')
    .select('*')
    .eq('mobile', mobile)
    .eq('joining_date', joining_date)
    .order('created_at', { ascending: false })
    .limit(1);

  if (error || !data || data.length === 0) return null;
  
  const record = data[0];
  if (typeof record.education === 'string') record.education = JSON.parse(record.education);
  if (typeof record.activities === 'string') record.activities = JSON.parse(record.activities);
  
  return record;
}

export async function getTeacherById(id: string) {
  // Use service role to bypass RLS — needed so PENDING teachers can view their profile
  const adminClient = getAdminSupabase()
  const { data, error } = await adminClient
    .from("teachers")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  
  // Parse JSONB arrays back to objects
  if (typeof data.education === 'string') data.education = JSON.parse(data.education);
  if (typeof data.activities === 'string') data.activities = JSON.parse(data.activities);
  
  return data;
}

export async function getAllApprovedTeachers() {
  const { data, error } = await supabase
    .from("teachers")
    .select("id, full_name_en, full_name_bn, designation, subject, joining_date, leaving_year, slug, photo_url, education, activities, memory_note, is_founder_guide, founder_guide_note")
    .eq("status", "APPROVED")
    .order("is_founder_guide", { ascending: false })
    .order("created_at", { ascending: true });

  if (error) return [];
  
  return data.map(record => {
    if (typeof record.education === 'string') record.education = JSON.parse(record.education);
    if (typeof record.activities === 'string') record.activities = JSON.parse(record.activities);
    return record;
  });
}

export async function updateTeacherProfile(id: string, updates: Partial<TeacherRecord>) {
  const { education, activities, ...rest } = updates;
  
  const dataToUpdate: any = { ...rest };
  if (education) dataToUpdate.education = JSON.stringify(education);
  if (activities) dataToUpdate.activities = JSON.stringify(activities);

  const { data, error } = await supabase
    .from("teachers")
    .update(dataToUpdate)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
