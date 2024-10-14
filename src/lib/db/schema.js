import { pgTable, varchar, primaryKey, serial, integer, doublePrecision, timestamp, json } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const cliente = pgTable("cliente", {
  chave: varchar("chave").primaryKey().notNull(),
  geo: varchar("geo"),
  unb: integer("unb").notNull(),
  codPdv: integer("cod_pdv").notNull(),
  comercial: varchar("comercial"),
  operação: varchar("operação"),
  tipoOperação: varchar("tipo_operação"),
  gv: integer("gv"),
  setor: integer("setor"),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
  nge: varchar("NGE"),
  segmentaçãoPrimária: varchar("segmentação_primária"),
  nomeFantasia: varchar("nome_fantasia"),
  documento: varchar("documento"),
  status: varchar("status"),
  dataCadastro: timestamp("data_cadastro", { mode: 'string' }),
  ultimaCompra: timestamp("ultima_compra", { mode: 'string' }),
});

export const cliente_direta = pgTable('cliente_direta', {
  eg: varchar("eg").primaryKey().notNull(),
  eg_dashed: varchar("eg_dashed"),
  cnpj: varchar("cnpj"),
  rede_uf: varchar("rede_uf"),
  site_rede: varchar("site_rede"),
  nome_fantasia: varchar("nome_fantasia"),
  cod_operacao: varchar("cod_operacao"),
  site: varchar("site"),
  uf: varchar("uf"),
  cidade: varchar("cidade"),
  cod_rede: varchar("cod_rede"),
  rede: varchar("rede"),
  gn: varchar("gn"),
  sn: varchar("sn"),
  le: varchar("le"),
  coordenador_trade: varchar("coordenador_trade"),
  inplant: varchar("inplant"),
  gc: varchar("gc"),
  gc_oeste: varchar("gc_oeste"),
  gn_sistema: varchar("gn_sistema"),
  sn_sistema: varchar("sn_sistema"),
  le_sistema: varchar("le_sistema"),
  cluster_loja: varchar("cluster_loja"),
  cluster_rede: varchar("cluster_rede"),
  segmentacao: varchar("segmentacao"),
  sub_segmentacao: varchar("sub_segmentacao"),
  categoria: varchar("categoria"),
  migracao_asr: varchar("migracao_asr"),
  programa_de_mercado: varchar("programa_de_mercado"),
  status_loja: varchar("status_loja"),
  loja_cd_normal_mista: varchar("loja_cd_normal_mista"),
  eg_central: varchar("eg_central"),
  eg_central2: varchar("eg_central_2"),
  mercado_nielsen: varchar("mercado_nielsen"),
  leitura_scanntech: varchar("leitura_scanntech"),
  leitura_neogrid: varchar("leitura_neogrid"),
  dummhumby: varchar("dummhumby"),
  shopping_brasil: varchar("shopping_brasil"),
  tamanho_loja: varchar("tamanho_loja"),
  cluster_trade: varchar("cluster_trade"),
  kam_nac: varchar("kam_nac"),
  diretor: varchar("diretor"),
  cnpj_dup: varchar("cnpj_dup"),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude")
});

export const coleta_pdv = pgTable("coleta_pdv", {
  id: integer("id").primaryKey().notNull(),
  chave: varchar("chave"),
  nome_usuario: varchar("nome_usuario"),
  data_visita: timestamp("data_visita", { mode: 'string' }),
  cod_pdv: integer("cod_pdv").notNull(),
  comercial: varchar("comercial"),
  operação: varchar("operação").notNull(),
  fachada: varchar('fachada'),
  cardapio: varchar('cardapio'),
  interior: varchar('interior'),
  materiais: json('materiais')
});

export const volume = pgTable('volume', {
  chave: varchar('chave').notNull(),
  ano: integer('ano').notNull(),
  mes: integer('mes').notNull(),
  cerveja: doublePrecision('cerveja'),
  nab: doublePrecision('nab'),
  rgb: doublePrecision('rgb'),
  brahma: doublePrecision('brahma'),
  spaten: doublePrecision('spaten'),
  corona: doublePrecision('corona'),
  bud: doublePrecision('bud'),
  stella: doublePrecision('stella'),
  skol: doublePrecision('skol'),
  antarctica: doublePrecision('antarctica'),
  guarana: doublePrecision('guarana'),
  beats: doublePrecision('beats'),
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.chave, table.ano, table.mes] }),
  };
})

export const pedidos_hub = pgTable('pedidos_hub', {
  chave: varchar('chave').notNull(),
  data_entrega: varchar('data_entrega'),
  marca: varchar('marca'),
  material: varchar('material'),
  descricao: varchar('descricao'),
  quantidade: varchar('quantidade')
}, (table) => { return { pk: primaryKey({ columns: [table.chave, table.descricao, table.data_entrega] }) } })
