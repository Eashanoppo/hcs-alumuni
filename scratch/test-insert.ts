
import { createClient } from "@supabase/supabase-js"
import * as dotenv from "dotenv"
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase credentials")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testInsert() {
  console.log("Attempting test insertion into 'teachers' table...")
  const testData = {
    full_name_en: "Test Teacher",
    full_name_bn: "টেস্ট শিক্ষক",
    designation: "Assistant Teacher",
    subject: "Mathematics",
    joining_date: "2020-01-01",
    leaving_year: "Present",
    present_address: "Test Address",
    mobile: "01700000000",
    email: "test@example.com",
    education: JSON.stringify([{level: "Masters", institution: "Test Univ", subject: "Math"}]),
    activities: JSON.stringify(["Teaching"]),
    status: "PENDING"
  }

  const { data, error } = await supabase
    .from('teachers')
    .insert([testData])
    .select()
  
  if (error) {
    console.error("Insert failed:", JSON.stringify(error, null, 2))
    
    if (error.code === 'PGRST116') {
        console.log("Checking if columns exist by trying individual fields...")
         // Try fetching schema info if possible or just try a simpler insert
    }
  } else {
    console.log("Insert successful! Row ID:", data?.[0]?.id)
  }
}

testInsert()
