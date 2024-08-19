import { pgTable, varchar, integer, doublePrecision, timestamp } from "drizzle-orm/pg-core"
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
