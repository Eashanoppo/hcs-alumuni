const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

try {
  const envFile = fs.readFileSync('.env', 'utf8')
  envFile.split('\n').forEach(line => {
    const [key, value] = line.split('=')
    if (key && value) {
      process.env[key.trim()] = value.trim()
    }
  })
} catch (e) {}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_Service_Role_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function debugApproval() {
  const teacherId = '1cbcc02d-1117-44b5-b12c-952397e4768d' // From user screenshot URL previously or just a target
  const status = 'APPROVED'
  
  console.log('Fetching teacher...')
  const { data: teacher } = await supabase.from('teachers').select('*').eq('id', teacherId).single();
  console.log('Current Status:', teacher?.status);

  console.log('Generating Teacher ID...')
  const { count } = await supabase.from('teachers').select('id', { count: 'exact', head: true }).eq('status', 'APPROVED');
  const nextId = `HCS-TCH-${((count || 0) + 1).toString().padStart(3, '0')}`;
  console.log('Proposed ID:', nextId);

  console.log('Updating...')
  const { error } = await supabase.from('teachers').update({ status, teacher_id: nextId }).eq('id', teacherId);
  
  if (error) {
    console.error('Update Error:', JSON.stringify(error, null, 2));
  } else {
    console.log('Update Successful');
  }
}

debugApproval()
