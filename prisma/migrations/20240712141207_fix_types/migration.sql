/*
  Warnings:

  - The values [KINDERHUTTE] on the enum `RelationRoleGottesdienst` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `externerPREDIGER` on the `Gottesdienst` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RelationRoleGottesdienst_new" AS ENUM ('TECHNIK_BILD', 'TECHNIK_TON', 'TECHNIK_STREAM', 'PREDIGER', 'MODERATOR', 'MUSIK', 'KINDERHUTE', 'KINDERTREFF', 'TEENETALK', 'BISTRO', 'PUTZTEAM', 'BEGRUSSUNG', 'TEAM');
ALTER TABLE "Gottesdienst_User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "team" ALTER COLUMN "name" DROP DEFAULT;
ALTER TABLE "Gottesdienst_User" ALTER COLUMN "role" TYPE "RelationRoleGottesdienst_new" USING ("role"::text::"RelationRoleGottesdienst_new");
ALTER TABLE "team" ALTER COLUMN "name" TYPE "RelationRoleGottesdienst_new" USING ("name"::text::"RelationRoleGottesdienst_new");
ALTER TYPE "RelationRoleGottesdienst" RENAME TO "RelationRoleGottesdienst_old";
ALTER TYPE "RelationRoleGottesdienst_new" RENAME TO "RelationRoleGottesdienst";
DROP TYPE "RelationRoleGottesdienst_old";
ALTER TABLE "Gottesdienst_User" ALTER COLUMN "role" SET DEFAULT 'TEAM';
ALTER TABLE "team" ALTER COLUMN "name" SET DEFAULT 'TEAM';
COMMIT;

-- AlterTable
ALTER TABLE "Gottesdienst" DROP COLUMN "externerPREDIGER",
ADD COLUMN     "externerPrediger" TEXT;
