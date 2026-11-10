import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_contact_submissions_age_range" AS ENUM('u18', '18-24', '25-34', '35-44', '45-54', '55-64', '65+');
  ALTER TABLE "contact_submissions" ALTER COLUMN "phone" SET NOT NULL;
  ALTER TABLE "contact_submissions" ADD COLUMN "age_range" "enum_contact_submissions_age_range" NOT NULL;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "contact_submissions" ALTER COLUMN "phone" DROP NOT NULL;
  ALTER TABLE "contact_submissions" DROP COLUMN "age_range";
  DROP TYPE "public"."enum_contact_submissions_age_range";`)
}
