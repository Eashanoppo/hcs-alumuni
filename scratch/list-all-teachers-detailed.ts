
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://vkjwumythmnkazuttjic.supabase.co"
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrand1bXl0aG1ua2F6dXR0amljIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDUwNTg0MywiZXhwIjoyMDkwMDgxODQzfQ.4ZkpCNV9phRdlvgvx5ys1hEiKDeCYSjzmHgXTk8U3dc"

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function listAll() {
  console.log("Listing all teachers with details...")
  const { data, error } = await supabase
    .from('teachers')
    .select('full_name_en, slug, status')
  
  if (error) {
    console.error("Fetch failed:", error)
  } else {
    data?.forEach(t => {
      console.log(`Name: ${t.full_name_en}, Slug: ${t.slug}, Status: ${t.status}`)
    })
  }
}

listAll()
