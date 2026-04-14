import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://holy-crescent.com';

  // Static routes
  const staticRoutes = [
    '',
    '/about',
    '/directory',
    '/teachers',
    '/gallery',
    '/notices',
    '/contact',
    '/registration',
    '/login/alumni',
    '/login/teachers',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Fetch dynamic notices
  const { data: notices } = await supabase
    .from('notices')
    .select('id, updated_at')
    .order('created_at', { ascending: false });

  const noticeRoutes = (notices || []).map((notice) => ({
    url: `${baseUrl}/notices/${notice.id}`,
    lastModified: new Date(notice.updated_at || new Date()),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // Fetch dynamic teachers
  const { data: teachers } = await supabase
    .from('teachers')
    .select('slug, updated_at')
    .eq('status', 'APPROVED');

  const teacherRoutes = (teachers || []).map((teacher) => ({
    url: `${baseUrl}/teachers/${teacher.slug}`,
    lastModified: new Date(teacher.updated_at || new Date()),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  return [...staticRoutes, ...noticeRoutes, ...teacherRoutes];
}
