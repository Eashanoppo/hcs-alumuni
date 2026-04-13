import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vkjwumythmnkazuttjic.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrand1bXl0aG1ua2F6dXR0amljIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDUwNTg0MywiZXhwIjoyMDkwMDgxODQzfQ.4ZkpCNV9phRdlvgvx5ys1hEiKDeCYSjzmHgXTk8U3dc'
const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
  let { data, error } = await supabase
    .from('registrants')
    .select('id, full_name_en, mobile, dob, full_name_bn')
    .eq('mobile', '01964385938')
    
  console.log("Exact match:", data, error)
  
  let { data: fuzzy } = await supabase
    .from('registrants')
    .select('id, full_name_en, mobile, dob')
    .ilike('mobile', '%01964385938%')
    
  console.log("Fuzzy match:", fuzzy)
}

run()
