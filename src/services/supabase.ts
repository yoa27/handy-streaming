import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// On vérifie si les clés sont présentes et ne sont pas les valeurs par défaut
const isConfigured = supabaseUrl && 
                   supabaseAnonKey && 
                   !supabaseUrl.includes('votre-projet');

if (!isConfigured) {
  console.warn("⚠️ Supabase n'est pas encore configuré. La connexion Google/GitHub ne fonctionnera pas tant que vous n'aurez pas rempli le fichier .env");
}

// On utilise des valeurs de secours pour éviter que createClient ne fasse planter l'app au chargement
export const supabase = createClient(
  isConfigured ? supabaseUrl : 'https://placeholder.supabase.co',
  isConfigured ? supabaseAnonKey : 'placeholder'
);
