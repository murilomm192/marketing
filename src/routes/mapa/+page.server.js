import { drizzle } from "drizzle-orm/postgres-js";
import { sql, eq, ilike, notInArray, inArray } from "drizzle-orm";
import postgres from "postgres";

import { db, supabase } from "$lib/db";

import { PUBLIC_GOOGLE_API_KEY } from "$env/static/public";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

/**
 * Retrieves public URLs for a specific column in the given dataset.
 *
 * @param {Array} base - The original dataset to process.
 * @param {string} bucket - The name of the storage bucket.
 * @param {string} column - The name of the column containing file paths.
 * @returns {Array} A new array with the original data and updated public URLs.
 *
 * This function takes a dataset, a storage bucket name, and a column name.
 * It then creates a new array where each row of the original dataset is updated
 * with a public URL for the file specified in the given column.
 * The public URL is generated using Supabase's storage.from().getPublicUrl() method.
 */
function get_public_url(base, bucket, column) {
  const baseurl = base.map((row) => ({
    ...row,
    [column]: supabase.storage.from(bucket).getPublicUrl(row[column]).data
      .publicUrl,
  }));
  return baseurl;
}

export const load = async () => {

  let base = await db.execute(sql`
  select *
  from coleta_pdv as c join cliente as pdv
  on c.chave = pdv.chave
  where pdv.latitude is not null order by random() limit 1000`);

  let volumes = await db.execute(sql`
select 
  v.chave,
  v.ano,
  v.mes,
  coalesce(v.cerveja, 0) as cerveja,
  coalesce(v.nab, 0) as nab,
  coalesce(v.rgb, 0) as rgb,
  coalesce(v.brahma, 0) as brahma,
  coalesce(v.spaten, 0) as spaten,
  coalesce(v.corona, 0) as corona,
  coalesce(v.bud, 0) as bud,
  coalesce(v.stella, 0) as stella,
  coalesce(v.skol, 0) as skol,
  coalesce(v.antarctica, 0) as antarctica,
  coalesce(v.guarana, 0) as guarana,
  coalesce(v.beats, 0) as beats
from coleta_pdv as c
left join volume as v on c.chave = v.chave
`);

  const buckets = ["Fachadas", "Cardapios", "Interiores"];
  const columns = ["fachada", "cardapio", "interior"];

  base = base.map((row) => {
    buckets.forEach((bucket, index) => {
      const column = columns[index];
      row[column] = supabase.storage
        .from(bucket)
        .getPublicUrl(row[column]).data.publicUrl;
    });
    return row;
  });

  return {
    ok: "ok",
    result: base,
    volumes
  };
};
