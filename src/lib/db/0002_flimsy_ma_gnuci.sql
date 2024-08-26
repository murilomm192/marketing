ALTER TABLE "coleta_pdv" ALTER COLUMN "id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "coleta_pdv" ALTER COLUMN "operação" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "coleta_pdv" ADD COLUMN "fachada" varchar;--> statement-breakpoint
ALTER TABLE "coleta_pdv" ADD COLUMN "cardapio" varchar;--> statement-breakpoint
ALTER TABLE "coleta_pdv" ADD COLUMN "interior" varchar;