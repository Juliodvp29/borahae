import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_event_registrations_modality" AS ENUM('presencial', 'virtual');
  ALTER TABLE "event_registrations" ADD COLUMN "city" varchar;
  ALTER TABLE "event_registrations" ADD COLUMN "modality" "enum_event_registrations_modality" NOT NULL;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "event_registrations" DROP COLUMN "city";
  ALTER TABLE "event_registrations" DROP COLUMN "modality";
  DROP TYPE "public"."enum_event_registrations_modality";`)
}
