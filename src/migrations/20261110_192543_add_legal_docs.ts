import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_legal_docs_slug" AS ENUM('politica-de-tratamiento-de-datos', 'terminos-y-condiciones', 'condiciones-de-viaje');
  CREATE TYPE "public"."enum_legal_docs_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__legal_docs_v_version_slug" AS ENUM('politica-de-tratamiento-de-datos', 'terminos-y-condiciones', 'condiciones-de-viaje');
  CREATE TYPE "public"."enum__legal_docs_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__legal_docs_v_published_locale" AS ENUM('es', 'ko');
  CREATE TABLE "legal_docs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" "enum_legal_docs_slug",
  	"version" varchar,
  	"effective_date" timestamp(3) with time zone,
  	"seo_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_legal_docs_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "legal_docs_locales" (
  	"title" varchar,
  	"body" jsonb,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_legal_docs_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" "enum__legal_docs_v_version_slug",
  	"version_version" varchar,
  	"version_effective_date" timestamp(3) with time zone,
  	"version_seo_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__legal_docs_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__legal_docs_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_legal_docs_v_locales" (
  	"version_title" varchar,
  	"version_body" jsonb,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "legal_docs_id" integer;
  ALTER TABLE "legal_docs" ADD CONSTRAINT "legal_docs_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "legal_docs_locales" ADD CONSTRAINT "legal_docs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."legal_docs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_legal_docs_v" ADD CONSTRAINT "_legal_docs_v_parent_id_legal_docs_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."legal_docs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_legal_docs_v" ADD CONSTRAINT "_legal_docs_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_legal_docs_v_locales" ADD CONSTRAINT "_legal_docs_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_legal_docs_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "legal_docs_seo_image_idx" ON "legal_docs" USING btree ("seo_image_id");
  CREATE INDEX "legal_docs_updated_at_idx" ON "legal_docs" USING btree ("updated_at");
  CREATE INDEX "legal_docs_created_at_idx" ON "legal_docs" USING btree ("created_at");
  CREATE INDEX "legal_docs__status_idx" ON "legal_docs" USING btree ("_status");
  CREATE UNIQUE INDEX "legal_docs_locales_locale_parent_id_unique" ON "legal_docs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "legal_docs_locales_parent_id_idx" ON "legal_docs_locales" USING btree ("_parent_id");
  CREATE INDEX "_legal_docs_v_parent_idx" ON "_legal_docs_v" USING btree ("parent_id");
  CREATE INDEX "_legal_docs_v_version_version_seo_image_idx" ON "_legal_docs_v" USING btree ("version_seo_image_id");
  CREATE INDEX "_legal_docs_v_version_version_updated_at_idx" ON "_legal_docs_v" USING btree ("version_updated_at");
  CREATE INDEX "_legal_docs_v_version_version_created_at_idx" ON "_legal_docs_v" USING btree ("version_created_at");
  CREATE INDEX "_legal_docs_v_version_version__status_idx" ON "_legal_docs_v" USING btree ("version__status");
  CREATE INDEX "_legal_docs_v_created_at_idx" ON "_legal_docs_v" USING btree ("created_at");
  CREATE INDEX "_legal_docs_v_updated_at_idx" ON "_legal_docs_v" USING btree ("updated_at");
  CREATE INDEX "_legal_docs_v_snapshot_idx" ON "_legal_docs_v" USING btree ("snapshot");
  CREATE INDEX "_legal_docs_v_published_locale_idx" ON "_legal_docs_v" USING btree ("published_locale");
  CREATE INDEX "_legal_docs_v_latest_idx" ON "_legal_docs_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_legal_docs_v_locales_locale_parent_id_unique" ON "_legal_docs_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_legal_docs_v_locales_parent_id_idx" ON "_legal_docs_v_locales" USING btree ("_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_legal_docs_fk" FOREIGN KEY ("legal_docs_id") REFERENCES "public"."legal_docs"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_legal_docs_id_idx" ON "payload_locked_documents_rels" USING btree ("legal_docs_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "legal_docs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "legal_docs_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_legal_docs_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_legal_docs_v_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "legal_docs" CASCADE;
  DROP TABLE "legal_docs_locales" CASCADE;
  DROP TABLE "_legal_docs_v" CASCADE;
  DROP TABLE "_legal_docs_v_locales" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_legal_docs_fk";
  
  DROP INDEX "payload_locked_documents_rels_legal_docs_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "legal_docs_id";
  DROP TYPE "public"."enum_legal_docs_slug";
  DROP TYPE "public"."enum_legal_docs_status";
  DROP TYPE "public"."enum__legal_docs_v_version_slug";
  DROP TYPE "public"."enum__legal_docs_v_version_status";
  DROP TYPE "public"."enum__legal_docs_v_published_locale";`)
}
