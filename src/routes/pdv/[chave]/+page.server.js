import { drizzle } from "drizzle-orm/postgres-js";
import { sql, eq, ilike, notInArray, inArray } from "drizzle-orm";
import postgres from "postgres";
import { page } from "$app/stores";

import { db, supabase } from "$lib/db";

import { PUBLIC_GOOGLE_API_KEY } from "$env/static/public";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

function get_public_url(base, bucket, column) {
  const baseurl = base.map((row) => ({
    ...row,
    [column]: supabase.storage.from(bucket).getPublicUrl(row[column]).data
      .publicUrl,
  }));
  return baseurl;
}

export const load = async ({url}) => {
  const chave = url.pathname.split('/').slice(-1)[0]

  let base = await db.execute(sql`
  select *
  from coleta_pdv as c join cliente as pdv
  on c.chave = pdv.chave
  where 
  c.chave = ${chave}
  order by c.data_visita desc
  `
);

  let volumes = await db.execute(sql`
select 
* from volume
where chave = ${chave}
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
    volumes,
  };
};
