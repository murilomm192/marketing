import { drizzle } from 'drizzle-orm/postgres-js';
import { sql, eq, ilike, notInArray, inArray } from 'drizzle-orm';
import postgres from 'postgres';
import { cliente_direta, coleta_pdv } from "$lib/db/schema.js"

import {
  PUBLIC_DATABASE_URL,
  PUBLIC_SUPABASE_URL,
  PUBLIC_SUPABASE_ANON_KEY
} from '$env/static/public';


import { createClient } from '@supabase/supabase-js';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

const connectionString = PUBLIC_DATABASE_URL;
const client = postgres(connectionString);
const db = drizzle(client);

export const load = async () => {
  const base_direta = await db.select({
    eg: cliente_direta.eg,
    nome_fantasia: cliente_direta.nome_fantasia,
    uf: cliente_direta.uf,
    cidade: cliente_direta.cidade,
    rede: cliente_direta.rede,
    gn: cliente_direta.gn,
    sn: cliente_direta.sn,
    le: cliente_direta.le,
    coordenador_trade: cliente_direta.coordenador_trade,
    inplant: cliente_direta.inplant,
    cluster_loja: cliente_direta.cluster_loja,
    segmentacao: cliente_direta.segmentacao,
    subsegmento: cliente_direta.sub_segmentacao,
    categoria: cliente_direta.categoria,
    programa_de_mercado: cliente_direta.programa_de_mercado,
    cluster_trade: cliente_direta.cluster_trade,
    latitude: cliente_direta.latitude,
    longituade: cliente_direta.longitude
  }).from(cliente_direta)


  return { base_direta: base_direta }
};

function upload_file(file, bucket) {
  return file.arrayBuffer()
    .then((r) =>
      supabase.storage.from(bucket).upload(`${new Date().toLocaleString('en-GB').replaceAll('/', '-')}.${file.name.split('.').pop()}`, r, {
        upsert: true
      })
    );
}

function get_public_url(base, bucket, coluna) {
  const base_url = base.map(row => ({
    ...row,
    image: supabase
      .storage
      .from(bucket)
      .getPublicUrl(row[coluna])
      .data
      .publicUrl
  }))
  return base_url
}

export const actions = {
  upload: async ({ request }) => {
    const data = await request.formData();

    const cardapio = data.get('cardapio').name !== '' ? await upload_file(data.get('cardapio'), 'Cardapios') : null;
    const fachada = data.get('fachada').name !== '' ? await upload_file(data.get('fachada'), 'Fachadas') : null;
    const interior = data.get('interior').name !== '' ? await upload_file(data.get('interior'), 'Interiores') : null;

    const dados = await JSON.parse(data.get('dados'));

    const upload = await db.insert(coleta_pdv).values({
      chave: dados.operação + '_' + dados.cod_pdv,
      nome_usuario: dados.nome,
      data_visita: dados.data_visita.toLocaleString(),
      cod_pdv: dados.cod_pdv,
      comercial: dados.comercial,
      operação: dados.operação,
      cardapio: cardapio ? cardapio.data.path : null,
      fachada: fachada ? fachada.data.path : null,
      interior: interior ? interior.data.path : null,
      materiais: dados.materiais,
    }).returning({ id: coleta_pdv.id })

  }
}
