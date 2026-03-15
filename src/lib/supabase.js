import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ezhukcbjrhxzamcjvial.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6aHVrY2Jqcmh4emFtY2p2aWFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1ODU3NTcsImV4cCI6MjA4OTE2MTc1N30.Ziw9MXtVhcVw22EUzXx0pASjGG1_pN0_qLQZlPQJi6U'

export const supabase = createClient(supabaseUrl, supabaseKey)
export const isSupabaseConfigured = () => true