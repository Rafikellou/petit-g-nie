import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/supabase'

const supabaseUrl = 'https://rgddalgzstcoysrcdetw.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnZGRhbGd6c3Rjb3lzcmNkZXR3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMjYyMTMxNCwiZXhwIjoyMDQ4MTk3MzE0fQ.jVtIWPiNTrUrTUbmOG_v9BgQ6yQ-m4sPBsqJEtYIky0'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
