const { createClient } = require('@supabase/supabase-js');
const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs');
require('dotenv').config({ path: 'g:/webs/hcs-registar/.env.local' });

async function verify() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_Service_Role_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'hcs_alumni_preset';

  console.log('--- Verifying Supabase ---');
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Check registrants table
  try {
    const { data: registrants, error: regError } = await supabase.from('registrants').select('id').limit(1);
    if (regError) {
      console.error('Error accessing registrants table:', regError.message);
    } else {
      console.log('✅ registrants table exists.');
    }
  } catch (e) {
    console.error('Failed to query registrants:', e.message);
  }

  // Check payments table
  try {
    const { data: payments, error: payError } = await supabase.from('payments').select('id').limit(1);
    if (payError) {
      console.error('Error accessing payments table:', payError.message);
    } else {
      console.log('✅ payments table exists.');
    }
  } catch (e) {
    console.error('Failed to query payments:', e.message);
  }

  console.log('\n--- Verifying Cloudinary ---');
  if (!cloudName) {
    console.error('❌ Cloudinary Cloud Name missing.');
  } else {
    console.log('Testing upload to Cloud name:', cloudName);
    console.log('Using Upload Preset:', uploadPreset);

    // Test a dummy upload if possible
    try {
      // Create a small dummy file
      const dummyContent = 'test';
      const formData = new FormData();
      formData.append('file', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==');
      formData.append('upload_preset', uploadPreset);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData
      });
      const result = await res.json();
      if (result.error) {
        console.error('❌ Cloudinary Upload Failed:', result.error.message);
      } else {
        console.log('✅ Cloudinary Upload Successful! URL:', result.secure_url);
      }
    } catch (e) {
      console.error('Cloudinary Request Failed:', e.message);
    }
  }
}

verify();
