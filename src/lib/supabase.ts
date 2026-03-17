import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
};

export type Project = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  status: 'idea' | 'en_progreso' | 'completado' | 'pausado';
  image_url: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  profiles?: Profile;
  tags?: Tag[];
  links?: ProjectLink[];
};

export type Tag = {
  id: string;
  name: string;
  created_at: string;
};

export type ProjectTag = {
  project_id: string;
  tag_id: string;
};

export type ProjectLink = {
  id: string;
  project_id: string;
  url: string;
  label: string;
  created_at: string;
};

export type Comment = {
  id: string;
  project_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  profiles?: Profile;
};
