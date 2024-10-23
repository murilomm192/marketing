import { drizzle } from 'drizzle-orm/postgres-js';
import { sql, eq, ilike, notInArray, inArray } from 'drizzle-orm';
import postgres from 'postgres';
import { cliente_direta, coleta_pdv, coleta_direta } from "$lib/db/schema.js"


import {
  PUBLIC_DATABASE_URL,
  PUBLIC_SUPABASE_URL,
  PUBLIC_SUPABASE_ANON_KEY
} from '$env/static/public';


import { createClient } from '@supabase/supabase-js';

//process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

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

function upload_file(file, bucket, token) {
  return file.arrayBuffer()
    .then((r) =>
      supabase.storage.from(bucket).uploadToSignedUrl(`${file.name.split('.').at(0)} - ${new Date().toLocaleString('en-GB').replaceAll('/', '-')}.${file.name.split('.').at(-1)}`, token, r, {
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

async function getSignedURL(bucket, file_name) {
  const { data, error } = await supabase
    .storage
    .from(bucket)
    .createSignedUploadUrl(file_name)
  return data.token
}

export const actions = {
  upload: async ({ request }) => {
    const data = await request.formData();


    const dados = JSON.parse(data.get('dados'))

    const foto_array = await data.getAll('imagens')

    const fotos = await Promise.all(foto_array.map(async (foto) => {
      file_name = `${foto.name.split('.').at(0)} - ${new Date().toLocaleString('en-GB').replaceAll('/', '-')}.${foto.name.split('.').at(-1)}`
      token = getSignedURL('Direta', file_name)
      const ok_foto = await upload_file(foto, 'Direta', token)
      return ok_foto
    })).then(async (values) => {
      const upload = await db.insert(coleta_direta).values({
        eg: dados.loja,
        nome_usuario: dados.nome,
        data_visita: dados.data_visita,
        materiais: dados.equipamentos.map((row) => {
          return { marca: row.nome, equipamentos: row.equipamentos }
        }),
        fotos: (values.map((foto) => {
          return foto.data.fullPath
        }))
      }).returning({ id: coleta_direta.id })

      console.log(upload)

    })





    // await data.getAll('imagens').map((file) => {
    //   const { data, error } = supabase
    //     .storage
    //     .from('Direta')
    //     .upload(file.name, file, {
    //       cacheControl: '3600',
    //       upsert: false
    //     })
    // })
  }
}

