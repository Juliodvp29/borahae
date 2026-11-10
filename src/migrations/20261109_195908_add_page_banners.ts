import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages" ADD COLUMN "banner_desktop_id" integer;
  ALTER TABLE "pages" ADD COLUMN "banner_mobile_id" integer;
  ALTER TABLE "_pages_v" ADD COLUMN "version_banner_desktop_id" integer;
  ALTER TABLE "_pages_v" ADD COLUMN "version_banner_mobile_id" integer;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_banner_desktop_id_media_id_fk" FOREIGN KEY ("banner_desktop_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_banner_mobile_id_media_id_fk" FOREIGN KEY ("banner_mobile_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_banner_desktop_id_media_id_fk" FOREIGN KEY ("version_banner_desktop_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_banner_mobile_id_media_id_fk" FOREIGN KEY ("version_banner_mobile_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_banner_desktop_idx" ON "pages" USING btree ("banner_desktop_id");
  CREATE INDEX "pages_banner_mobile_idx" ON "pages" USING btree ("banner_mobile_id");
  CREATE INDEX "_pages_v_version_version_banner_desktop_idx" ON "_pages_v" USING btree ("version_banner_desktop_id");
  CREATE INDEX "_pages_v_version_version_banner_mobile_idx" ON "_pages_v" USING btree ("version_banner_mobile_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages" DROP CONSTRAINT "pages_banner_desktop_id_media_id_fk";
  
  ALTER TABLE "pages" DROP CONSTRAINT "pages_banner_mobile_id_media_id_fk";
  
  ALTER TABLE "_pages_v" DROP CONSTRAINT "_pages_v_version_banner_desktop_id_media_id_fk";
  
  ALTER TABLE "_pages_v" DROP CONSTRAINT "_pages_v_version_banner_mobile_id_media_id_fk";
  
  DROP INDEX "pages_banner_desktop_idx";
  DROP INDEX "pages_banner_mobile_idx";
  DROP INDEX "_pages_v_version_version_banner_desktop_idx";
  DROP INDEX "_pages_v_version_version_banner_mobile_idx";
  ALTER TABLE "pages" DROP COLUMN "banner_desktop_id";
  ALTER TABLE "pages" DROP COLUMN "banner_mobile_id";
  ALTER TABLE "_pages_v" DROP COLUMN "version_banner_desktop_id";
  ALTER TABLE "_pages_v" DROP COLUMN "version_banner_mobile_id";`)
}
