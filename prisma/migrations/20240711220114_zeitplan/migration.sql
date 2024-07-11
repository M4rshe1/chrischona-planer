/*
  Warnings:

  - You are about to drop the column `role` on the `Gottesdienst_User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Gottesdienst_User" DROP COLUMN "role",
ADD COLUMN     "PREDIGER" "RelationRoleGottesdienst" NOT NULL DEFAULT 'TEAM';

-- AlterTable
ALTER TABLE "Zeitplan" ALTER COLUMN "durationMin" DROP NOT NULL,
ALTER COLUMN "timeFrom" DROP NOT NULL,
ALTER COLUMN "timeFrom" SET DATA TYPE TEXT;
