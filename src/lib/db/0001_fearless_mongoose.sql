CREATE TABLE IF NOT EXISTS "coleta_pdv" (
	"id" varchar PRIMARY KEY NOT NULL,
	"nome_usuario" varchar,
	"data_visita" timestamp,
	"cod_pdv" integer NOT NULL,
	"comercial" varchar,
	"operação" varchar,
	"materiais" json
);
