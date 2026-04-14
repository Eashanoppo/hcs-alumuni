import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_Service_Role_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkSchema() {
  console.log('--- Teachers Table Data ---')
  const { data: teachers, error: tError } = await supabase.from('teachers').select('*').limit(1)
  if (tError) console.error(tError)
  else console.log(Object.keys(teachers?.[0] || {}))

  console.log('--- Payments Table Data ---')
  const { data: payments, error: pError } = await supabase.from('payments').select('*').limit(1)
  if (pError) console.error(pError)
  else console.log(Object.keys(payments?.[0] || {}))
}

checkSchema()
