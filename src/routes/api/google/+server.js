import { json } from "@sveltejs/kit";
import { PUBLIC_GOOGLE_API_KEY } from "$env/static/public";

async function get_detalhes(latitude, longitude, nome_fantasia) {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&keyword=${nome_fantasia}&radius=50&key=${PUBLIC_GOOGLE_API_KEY}`
  );
  const dados = await response.json();
  const resultados = await dados.results[0];
  const ob = {
    nome: resultados.name,
    place_id: resultados.place_id,
    preço: resultados.price_level,
    rating: resultados.rating,
    tipo_estabelecimento: resultados.types,
  };
  return ob;
}

export async function GET({ url }) {
  const latitude = url.searchParams.get("lat");
  const longitude = url.searchParams.get("long");
  const nome = url.searchParams.get("nome");
  return json(await get_detalhes(latitude, longitude, nome));
}
