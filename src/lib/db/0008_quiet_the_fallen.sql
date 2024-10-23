CREATE TABLE IF NOT EXISTS "coleta_direta" (
	"id" integer PRIMARY KEY NOT NULL,
	"eg" varchar,
	"nome_usuario" varchar,
	"data_visita" timestamp,
	"materiais" json,
	"fotos" json
);
