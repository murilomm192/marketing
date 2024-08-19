-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE IF NOT EXISTS "cliente" (
	"chave" varchar PRIMARY KEY NOT NULL,
	"geo" varchar,
	"unb" integer NOT NULL,
	"cod_pdv" integer NOT NULL,
	"comercial" varchar,
	"operação" varchar,
	"tipo_operação" varchar,
	"gv" integer,
	"setor" integer,
	"latitude" double precision,
	"longitude" double precision,
	"NGE" varchar,
	"segmentação_primária" varchar,
	"nome_fantasia" varchar,
	"documento" varchar,
	"status" varchar,
	"data_cadastro" timestamp,
	"ultima_compra" timestamp
);

*/