import { createClient } from '@supabase/supabase-js'

const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabaseUrl = rawUrl;
let supabaseAnonKey = rawKey;

if (!supabaseUrl || !supabaseUrl.startsWith('http')) {
  console.warn("⚠️ Attention: Les clés Supabase ne sont pas configurées ou sont invalides dans le fichier .env.local");
  supabaseUrl = 'https://placeholder.supabase.co';
} else {
  // Nettoyage de l'URL au cas où l'utilisateur aurait copié un morceau en trop (ex: /rest/v1)
  supabaseUrl = supabaseUrl.trim().replace(/\/$/, '');
  if (supabaseUrl.endsWith('/rest/v1')) {
    supabaseUrl = supabaseUrl.replace('/rest/v1', '');
  }
}

if (!supabaseAnonKey) {
  supabaseAnonKey = 'placeholder_key';
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
