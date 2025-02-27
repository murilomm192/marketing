import { cliente_direta, coleta_direta } from "$lib/db/schema";
import { db, supabase } from "$lib/db"
import { eq, sql, not, and } from "drizzle-orm";

// Function to get a public URL from Supabase
function getSupabaseUrl(path) {
  if (!path) return null;
  
  // If it's already a full URL, return it as is
  if (path.startsWith('http')) return path;
  
  // If it's a data URL, return it as is
  if (path.startsWith('data:')) return path;
  
  // Otherwise, get the public URL from Supabase
  try {
    const { data } = supabase.storage.from('Direta').getPublicUrl(path);
    return data?.publicUrl || null;
  } catch (error) {
    console.error('Error getting Supabase URL:', error);
    return null;
  }
}

// Process photos to convert paths to public URLs
function processPhotos(photos) {
  if (!photos) return null;
  
  // If photos is an array
  if (Array.isArray(photos)) {
    return photos.map(photo => getSupabaseUrl(photo)).filter(Boolean);
  }
  
  // If photos is an object
  if (typeof photos === 'object' && photos !== null) {
    const processedPhotos = {};
    
    for (const [category, items] of Object.entries(photos)) {
      if (typeof items === 'object' && items !== null) {
        if (Array.isArray(items)) {
          processedPhotos[category] = items.map(photo => getSupabaseUrl(photo)).filter(Boolean);
        } else {
          processedPhotos[category] = {};
          for (const [label, photo] of Object.entries(items)) {
            processedPhotos[category][label] = getSupabaseUrl(photo);
          }
        }
      } else if (typeof items === 'string') {
        processedPhotos[category] = getSupabaseUrl(items);
      }
    }
    
    return processedPhotos;
  }
  
  // If photos is a string
  if (typeof photos === 'string') {
    return getSupabaseUrl(photos);
  }
  
  return null;
}

export const load = async () => {
  // Fetch basic data for map points with distinct EG values
  const coletas = await db.selectDistinctOn([cliente_direta.eg], {
    eg: coleta_direta.eg,
    latitude: cliente_direta.latitude,
    longitude: cliente_direta.longitude,
    nome_fantasia: cliente_direta.nome_fantasia,
    segmento: cliente_direta.segmentacao,
    cidade: cliente_direta.cidade,
    uf: cliente_direta.uf,
    rede: cliente_direta.rede,
    cluster_trade: cliente_direta.cluster_trade,
    tamanho_loja: cliente_direta.tamanho_loja,
    status_loja: cliente_direta.status_loja
  }).from(coleta_direta)
    .leftJoin(cliente_direta, eq(coleta_direta.eg, cliente_direta.eg))
    .where(and(not(eq(coleta_direta.eg, "")), not(eq(cliente_direta.latitude, 0))))

  // Fetch detailed data for each EG including visit information, materials and photos
  const eg_details_raw = await db.select({
    id: coleta_direta.id,
    eg: coleta_direta.eg,
    nome_usuario: coleta_direta.nome_usuario,
    data_visita: coleta_direta.data_visita,
    materiais: coleta_direta.materiais,
    fotos: coleta_direta.fotos
  }).from(coleta_direta)
    .where(not(eq(coleta_direta.eg, "")))
    .orderBy(coleta_direta.data_visita)
    
  // Process photos to get public URLs
  const eg_details = eg_details_raw.map(detail => ({
    ...detail,
    fotos: processPhotos(detail.fotos)
  }));

  // Fetch all cliente_direta data for detailed view
  const clientes = await db.select().from(cliente_direta)
    .where(not(eq(cliente_direta.latitude, 0)))

  return { 
    coletas, 
    eg_details,
    clientes
  };
};
