
import { drizzle } from 'drizzle-orm/postgres-js';
import { sql, eq, ilike, notInArray, inArray } from 'drizzle-orm';
import postgres from 'postgres';
import {
  PUBLIC_DATABASE_URL,
  PUBLIC_SUPABASE_URL,
  PUBLIC_SUPABASE_ANON_KEY
} from '$env/static/public';

// import { createClient } from '@supabase/supabase-js';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

const connectionString = PUBLIC_DATABASE_URL;
const client = postgres(connectionString);
const db = drizzle(client);

export const load = (async () => {

  let base = await db.execute(sql`select * from cliente where comercial = 'COM DF' and latitude is not null limit 1000`)

  return {
    ok: 'ok',
    result: base
  }
})
