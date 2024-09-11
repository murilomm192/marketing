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
