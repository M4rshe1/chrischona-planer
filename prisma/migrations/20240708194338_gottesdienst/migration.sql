/*
  Warnings:

  - You are about to drop the column `externerPastor` on the `Gottesdienst` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Gottesdienst" DROP COLUMN "externerPastor",
ADD COLUMN     "externerPREDIGER" TEXT;
