import { coleta_pdv } from '$lib/db/schema';
import { db } from '$lib/db';

export async function load() {
  try {
    const data = await db.select().from(coleta_pdv);
    return { data };
  } catch (error) {
    console.error('Error fetching data:', error);
    return { data: [], error: 'Failed to fetch data' };
  }
}