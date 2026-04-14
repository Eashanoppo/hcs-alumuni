"use server"

import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import { TeacherRecord } from "@/lib/teacher-db"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_Service_Role_KEY!

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
})

export async function adminGetAllTeachers() {
  const cookieStore = await cookies();
  const session = cookieStore.get('hcs_admin_session');
  if (!session || session.value !== 'authenticated') return null;

  const { data, error } = await supabaseAdmin
    .from('teachers')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching teachers:", error);
    return null;
  }

  return data.map(record => {
    if (typeof record.education === 'string') record.education = JSON.parse(record.education);
    if (typeof record.activities === 'string') record.activities = JSON.parse(record.activities);
    return record;
  });
}

export async function adminUpdateTeacherStatus(id: string, status: 'APPROVED' | 'REJECTED'): Promise<{ success: boolean; error?: string }> {
  console.log(`[AdminAction] START: Updating teacher ${id} to ${status}`);
  const cookieStore = await cookies();
  const session = cookieStore.get('hcs_admin_session');
  if (!session || session.value !== 'authenticated') {
    return { success: false, error: "Authentication failure: No valid session" };
  }

  try {
    let updateData: any = { status };

    if (status === 'APPROVED') {
      // Check if teacher already has an ID
      const { data: current, error: fetchError } = await supabaseAdmin
        .from('teachers')
        .select('teacher_id')
        .eq('id', id)
        .single();
      
      if (fetchError) {
        console.error("[AdminAction] Error fetching current teacher:", fetchError);
        return { success: false, error: `Error fetching teacher records: ${fetchError.message}` };
      }
      
      if (!current?.teacher_id) {
        // Find existing IDs to determine next sequence
        const { data: existingIds, error: idError } = await supabaseAdmin
          .from('teachers')
          .select('teacher_id')
          .not('teacher_id', 'is', null)
          .like('teacher_id', 'HCS-TCH-%');
          
        if (idError) {
          console.error("[AdminAction] Error fetching existing IDs:", idError);
          return { success: false, error: `Failed to generate ID: ${idError.message}` };
        }

        let nextNum = 1;
        if (existingIds && existingIds.length > 0) {
          const nums = existingIds
            .map(t => {
              const match = t.teacher_id?.match(/HCS-TCH-(\d+)/);
              return match ? parseInt(match[1], 10) : 0;
            })
            .filter(n => !isNaN(n));
          
          if (nums.length > 0) {
            nextNum = Math.max(...nums) + 1;
          }
        }
        
        updateData.teacher_id = `HCS-TCH-${nextNum.toString().padStart(3, '0')}`;
        console.log(`[AdminAction] New teacher_id generated: ${updateData.teacher_id}`);
      }
    }

    const { error: updateError } = await supabaseAdmin
      .from('teachers')
      .update(updateData)
      .eq('id', id);

    if (updateError) {
      console.error("[AdminAction] FINAL UPDATE ERROR:", updateError);
      return { success: false, error: updateError.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error("[AdminAction] UNEXPECTED EXCEPTION:", err);
    return { success: false, error: err.message || "An unexpected error occurred." };
  }
}

export async function adminDeleteTeacher(id: string) {
  const cookieStore = await cookies();
  const session = cookieStore.get('hcs_admin_session');
  if (!session || session.value !== 'authenticated') return false;

  const { error } = await supabaseAdmin.from('teachers').delete().eq('id', id);
  return !error;
}

export async function adminBulkUpdateTeacherStatus(ids: string[], status: 'APPROVED' | 'REJECTED'): Promise<{ success: boolean; error?: string }> {
  const cookieStore = await cookies();
  const session = cookieStore.get('hcs_admin_session');
  if (!session || session.value !== 'authenticated') return { success: false, error: "Authentication failure" };
  
  try {
    if (status === 'APPROVED') {
      // Need to assign individual IDs sequentially, so loop
      for (const id of ids) {
        const res = await adminUpdateTeacherStatus(id, status);
        if (!res.success) return res;
      }
      return { success: true };
    } else {
      // Bulk reject
      const { error } = await supabaseAdmin.from('teachers').update({ status }).in('id', ids);
      if (error) return { success: false, error: error.message };
      return { success: true };
    }
  } catch (err: any) {
    return { success: false, error: err.message || "Bulk update failed" };
  }
}

export async function adminBulkDeleteTeachers(ids: string[]) {
  const cookieStore = await cookies();
  const session = cookieStore.get('hcs_admin_session');
  if (!session || session.value !== 'authenticated') return false;

  const { error } = await supabaseAdmin.from('teachers').delete().in('id', ids);
  return !error;
}

export async function adminUpdateTeacher(id: string, updateData: Partial<TeacherRecord>) {
  const cookieStore = await cookies();
  const session = cookieStore.get('hcs_admin_session');
  if (!session || session.value !== 'authenticated') return false;

  const dataToUpdate = { ...updateData };
  if (dataToUpdate.education) {
    dataToUpdate.education = JSON.stringify(dataToUpdate.education) as any;
  }
  if (dataToUpdate.activities) {
    dataToUpdate.activities = JSON.stringify(dataToUpdate.activities) as any;
  }

  const { error } = await supabaseAdmin
    .from('teachers')
    .update(dataToUpdate)
    .eq('id', id);

  if (error) {
    console.error("Failed to update teacher", error);
    return false;
  }
  return true;
}

export async function adminGetTeacherByIdForAdmin(id: string) {
  const cookieStore = await cookies();
  const session = cookieStore.get('hcs_admin_session');
  if (!session || session.value !== 'authenticated') return null;

  const { data, error } = await supabaseAdmin
    .from('teachers')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;

  if (typeof data.education === 'string') data.education = JSON.parse(data.education);
  if (typeof data.activities === 'string') data.activities = JSON.parse(data.activities);

  return data;
}
