const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

// Try to read .env file manually if process.env is missing them
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

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Supabase URL or Service Key missing')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkSchema() {
  console.log('--- Teachers Table Data ---')
  const { data: teachers, error: tError } = await supabase.from('teachers').select('*').limit(1)
  if (tError) console.error(tError)
  else if (teachers && teachers.length > 0) console.log(JSON.stringify(Object.keys(teachers[0])))
  else console.log('Empty table')

  console.log('--- Payments Table Data ---')
  const { data: payments, error: pError } = await supabase.from('payments').select('*').limit(1)
  if (pError) console.error(pError)
  else if (payments && payments.length > 0) console.log(JSON.stringify(Object.keys(payments[0])))
  else console.log('Empty table')
}

checkSchema()
