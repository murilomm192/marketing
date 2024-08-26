import { pgTable, varchar, serial, integer, doublePrecision, timestamp, json } from "drizzle-orm/pg-core"
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
