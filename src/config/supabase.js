import { createClient } from '@supabase/supabase-js';

// Get your Supabase URL and Anon Key from: https://app.supabase.com
// Project Settings > API keys

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
