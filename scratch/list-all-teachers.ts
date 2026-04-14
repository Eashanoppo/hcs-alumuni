
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://vkjwumythmnkazuttjic.supabase.co"
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrand1bXl0aG1ua2F6dXR0amljIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDUwNTg0MywiZXhwIjoyMDkwMDgxODQzfQ.4ZkpCNV9phRdlvgvx5ys1hEiKDeCYSjzmHgXTk8U3dc"

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function listAll() {
  console.log("Listing all teachers using service role...")
  const { data, error, count } = await supabase
    .from('teachers')
    .select('*', { count: 'exact' })
  
  if (error) {
    console.error("Fetch failed:", error)
  } else {
    console.log(`Actual count in DB: ${count}`)
    console.log("Teacher names:", data?.map(t => t.full_name_en || t.full_name || 'NO NAME'))
  }
}

listAll()
