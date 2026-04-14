
import { createClient } from "@supabase/supabase-js"
import * as dotenv from "dotenv"
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_Service_Role_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase credentials")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function debugData() {
  console.log("Checking teachers table...")
  const { data, error, count } = await supabase
    .from('teachers')
    .select('*', { count: 'exact' })
  
  if (error) {
    console.error("Error fetching teachers:", error)
  } else {
    console.log(`Found ${count} teachers.`)
    console.log("Data snippet:", JSON.stringify(data?.[0], null, 2))
  }
}

debugData()
