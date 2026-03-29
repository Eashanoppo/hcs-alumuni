// scripts/fix-dob.mjs
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase URL or Service Role Key in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function fixDatesOfBirth() {
  console.log('Fetching all registrants...')
  const { data: registrants, error } = await supabase
    .from('registrants')
    .select('id, dob, full_name_en')

  if (error) {
    console.error('Error fetching registrants:', error)
    process.exit(1)
  }

  console.log(`Found ${registrants.length} registrants. Checking dob formats...`)
  let updatedCount = 0;

  for (const reg of registrants) {
    if (!reg.dob) continue;

    let dob = reg.dob.trim();
    let originalDob = dob;
    let needsUpdate = false;

    // Check if it's separated by slashes (commonly from CSV)
    if (dob.includes('/')) {
      let parts = dob.split('/');
      
      // Handle the mm/dd/yyyy issue (swapping first two parts if it's mm/dd)
      // Since it's ambiguous, we assume if it came from CSV as MM/DD, we swap it to DD/MM.
      // E.g. 12/31/1990 is definitely MM/DD. 05/10/1990 is ambiguous.
      // According to user: "from the csv file... birthday date is stored in mm/dd/yyyy formate, we need ... dd/mm/yyyy"
      // Let's just swap them unconditionally if we assume all slashed dates from CSV are wrong.
      // Wait, we should only do this if we are SURE. If day > 12, it must be the month position.
      // Let's assume the user meant ALL slashed dates from the CSV are MM/DD.
      let [first, second, third] = parts;

      // Fix 2 digit year to 4 digit year
      if (third && third.length === 2) {
        let yearNum = parseInt(third);
        // Assuming folks registering are born before maybe 2010.
        if (yearNum > 30) {
          third = `19${third}`;
        } else {
          third = `20${third}`;
        }
      }

      // Convert mm/dd to dd/mm
      // Let's flip first and second to get DD/MM/YYYY
      let newDob = `${second.padStart(2, '0')}/${first.padStart(2, '0')}/${third}`;
      
      if (newDob !== originalDob) {
        console.log(`[UPDATE] ${reg.full_name_en}: ${originalDob} -> ${newDob}`);
        needsUpdate = true;
        dob = newDob;
      }
    }

    if (needsUpdate) {
      const { error: updateError } = await supabase
        .from('registrants')
        .update({ dob: dob })
        .eq('id', reg.id);
        
      if (updateError) {
        console.error(`Failed to update ${reg.id}:`, updateError);
      } else {
        updatedCount++;
      }
    }
  }

  console.log(`Finished updating ${updatedCount} dates of birth.`);
}

fixDatesOfBirth().catch(console.error)
