/*
  Warnings:

  - You are about to drop the column `PREDIGER` on the `Gottesdienst_User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Gottesdienst_User" DROP COLUMN "PREDIGER",
ADD COLUMN     "role" "RelationRoleGottesdienst" NOT NULL DEFAULT 'TEAM';
