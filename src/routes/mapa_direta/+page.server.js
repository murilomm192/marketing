import { cliente_direta, coleta_direta } from "$lib/db/schema";
import { db } from "$lib/db"
import { eq, sql, not, and } from "drizzle-orm";

function get_public_url(base, bucket, column) {
  const baseurl = base.map((row) => ({
    ...row,
    [column]: supabase.storage.from(bucket).getPublicUrl(row[column]).data
      .publicUrl,
  }));
  return baseurl;
}

export const load = async () => {
  const coletas = await db.selectDistinctOn([cliente_direta.eg], {
    eg: coleta_direta.eg,
    latitude: cliente_direta.latitude,
    longitude: cliente_direta.longitude,
    nome_fantasia: cliente_direta.nome_fantasia,
    segmento: cliente_direta.segmentacao
  }).from(coleta_direta).leftJoin(cliente_direta, eq(coleta_direta.eg, cliente_direta.eg)).where(and(not(eq(coleta_direta.eg, "")), not(eq(cliente_direta.latitude, 0))))

  let eg = await db.select().from(coleta_direta)
  return { coletas, eg }
}


