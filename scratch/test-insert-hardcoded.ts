
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://vkjwumythmnkazuttjic.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrand1bXl0aG1ua2F6dXR0amljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1MDU4NDMsImV4cCI6MjA5MDA4MTg0M30.0H4NJA1zgq0UX0Y0ULqLBooXz12WVu835HmLknoUKYY"

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testInsert() {
  console.log("Attempting test insertion into 'teachers' table...")
  const testData = {
    full_name_en: "Test Teacher " + Date.now(),
    full_name_bn: "টেস্ট শিক্ষক",
    designation: "Assistant Teacher",
    subject: "Mathematics",
    joining_date: "2020-01-01",
    leaving_year: "Present",
    present_address: "Test Address",
    mobile: "0" + Math.floor(Math.random() * 10000000000),
    email: "test@example.com",
    education: JSON.stringify([{level: "Masters", institution: "Test Univ", subject: "Math"}]),
    activities: JSON.stringify(["Teaching"]),
    slug: "test-teacher-" + Date.now()
  }

  const { data, error } = await supabase
    .from('teachers')
    .insert([testData])
    .select()
  
  if (error) {
    console.error("Insert failed:", JSON.stringify(error, null, 2))
  } else {
    console.log("Insert successful! Row ID:", data?.[0]?.id)
  }
}

testInsert()
