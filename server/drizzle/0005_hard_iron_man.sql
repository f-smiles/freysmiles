ALTER TABLE "invoices" ADD COLUMN "updated" timestamp DEFAULT now() NOT NULL;