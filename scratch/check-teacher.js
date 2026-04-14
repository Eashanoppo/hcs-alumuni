const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTeacher() {
  const { data, error } = await supabase
    .from('teachers')
    .select('full_name_en, slug, status')
    .or('slug.eq.test-user,full_name_en.ilike.%test%');

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('Teachers found:', JSON.stringify(data, null, 2));
}

checkTeacher();
