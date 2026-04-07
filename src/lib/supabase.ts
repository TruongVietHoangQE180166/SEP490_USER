import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl) console.error('[Supabase] Missing NEXT_PUBLIC_SUPABASE_URL');
if (!supabaseAnonKey) console.error('[Supabase] Missing NEXT_PUBLIC_SUPABASE_ANON_KEY');

// Initialize only if keys exist
export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
