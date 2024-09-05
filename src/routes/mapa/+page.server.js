
import { drizzle } from 'drizzle-orm/postgres-js';
import { sql, eq, ilike, notInArray, inArray } from 'drizzle-orm';
import postgres from 'postgres';

import { db, supabase } from '$lib/db';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

function get_public_url(base, bucket, column) {
  const baseurl = base.map(row => ({ ...row, [column]: supabase.storage.from(bucket).getPublicUrl(row[column]).data.publicUrl }))
  return baseurl
}

export const load = (async () => {

  let base = await db.execute(sql`
  select *
  from coleta_pdv as c join cliente as pdv
  on c.chave = pdv.chave
  where pdv.latitude is not null order by random() limit 1000`)

  let volumes = await db.execute(sql`
select 
  v.chave,
  v.ano,
  v.mes,
  case when v.cerveja is null then 0 else v.cerveja end,
 case when v.nab is null then 0 else v.nab end,
 case when v.rgb is null then 0 else v.rgb end,
 case when v.brahma is null then 0 else v.brahma end,
 case when v.spaten is null then 0 else v.spaten end,
 case when v.corona is null then 0 else v.corona end,
 case when v.bud is null then 0 else v.bud end,
 case when v.stella is null then 0 else v.stella end,
 case when v.skol is null then 0 else v.skol end,
 case when v.antarctica is null then 0 else v.antarctica end,
 case when v.guarana is null then 0 else v.guarana end,
  case when v.beats is null then 0 else v.beats end
from volume as v right join coleta_pdv as c on c.chave = v.chave
`)

  base = get_public_url(base, 'Fachadas', 'fachada')
  base = get_public_url(base, 'Cardapios', 'cardapio')
  base = get_public_url(base, 'Interiores', 'interior')

  return {
    ok: 'ok',
    result: base,
    volumes: volumes
  }
})
