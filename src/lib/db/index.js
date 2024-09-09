import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

import { createClient } from '@supabase/supabase-js';

import {
  PUBLIC_DATABASE_URL,
  PUBLIC_SUPABASE_URL,
  PUBLIC_SUPABASE_ANON_KEY,
  PUBLIC_GOOGLE_API_KEY
} from '$env/static/public';

const client = postgres(PUBLIC_DATABASE_URL);
export const db = drizzle(client, { schema });

export const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);