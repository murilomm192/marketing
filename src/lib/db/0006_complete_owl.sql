CREATE TABLE IF NOT EXISTS "pedidos_hub" (
	"chave" varchar NOT NULL,
	"data_entrega" varchar,
	"marca" varchar,
	"material" varchar,
	"descricao" varchar,
	"quantidade" varchar,
	CONSTRAINT "pedidos_hub_chave_descricao_data_entrega_pk" PRIMARY KEY("chave","descricao","data_entrega")
);
