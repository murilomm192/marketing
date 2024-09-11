import { drizzle } from "drizzle-orm/postgres-js";
import { sql, eq, ilike, notInArray, inArray } from "drizzle-orm";
import postgres from "postgres";
import { page } from "$app/stores";

import { db, supabase } from "$lib/db";

import { PUBLIC_GOOGLE_API_KEY } from "$env/static/public";

async function get_detalhes(latitude, longitude, nome_fantasia) {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&keyword=${nome_fantasia}&radius=150&key=${PUBLIC_GOOGLE_API_KEY}`
  );
  const dados = await response.json();
  const resultados = await dados.results[0];
  if (resultados === undefined) {
    return {
      nome: 'Não encontrado',
      place_id: 'Não encontrado',
      preço: 'Não encontrado',
      rating: 'Não encontrado',
      n_reviews: 'Não encontrado',
      tipo_estabelecimento: 'Não encontrado',
    };
  }
  const ob = {
    nome: resultados.name,
    place_id: resultados.place_id,
    preço: resultados.price_level,
    rating: resultados.rating,
    n_reviews: resultados.user_ratings_total,
    tipo_estabelecimento: resultados.types.reduce((acc, cur) => acc + ', ' + cur),
  };
  return ob;
}

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

function get_public_url(base, bucket, column) {
  const baseurl = base.map((row) => ({
    ...row,
    [column]: supabase.storage.from(bucket).getPublicUrl(row[column]).data
      .publicUrl,
  }));
  return baseurl;
}

export const load = async ({ url }) => {
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

  let detalhes_google = await get_detalhes(base[0].latitude, base[0].longitude, base[0].nome_fantasia);

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
  coalesce(v.beats, 0) as beats from volume as v
where chave = ${chave}
`);

  let pedidos_hub = await db.execute(sql`
select 
  * from pedidos_hub
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
    pedidos_hub: pedidos_hub,
    google: detalhes_google
  };
};
